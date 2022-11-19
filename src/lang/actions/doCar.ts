import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import type { Value } from "../value"
import * as Values from "../value"

export function doCar(target: Value): Value {
  if (target.kind === "Cons") {
    return target.car
  }

  if (target.kind !== "TypedNeutral") {
    throw new Errors.EvaluationError(
      [
        `[doCar] expect target to be TypedNeutral`,
        `  target.kind: ${target.kind}`,
      ].join("\n"),
    )
  }

  if (target.type.kind !== "Sigma") {
    throw new Errors.EvaluationError(
      [
        `[doCar] When target is a TypedNeutral, expect target.type to be Sigma`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    target.type.carType,
    Neutrals.Car(target.neutral, target.type),
  )
}
