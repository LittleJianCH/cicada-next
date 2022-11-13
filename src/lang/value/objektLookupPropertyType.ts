import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Errors from "../errors"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function objektLookupPropertyType(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value | undefined {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (clazz.name === name) return clazz.propertyType

      const rest = applyClosure(
        clazz.restClosure,
        Actions.doDot(target, clazz.name),
      )

      assertClazz(rest)

      clazz = rest
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (clazz.name === name) return clazz.propertyType

      clazz = clazz.rest
    }
  }

  return undefined
}

export function objektLookupPropertyTypeOrFail(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value {
  const propertyType = objektLookupPropertyType(target, clazz, name)
  if (propertyType === undefined) {
    throw new Errors.EvaluationError(
      `[objektLookupPropertyTypeOrFail] undefined property type name: ${name}`,
    )
  }

  return propertyType
}
