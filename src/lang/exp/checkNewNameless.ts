import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check } from "../exp"
import * as Values from "../value"
import { assertClazzInCtx, readback } from "../value"

export function checkNewNameless(
  ctx: Ctx,
  args: Array<Exps.Arg>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz.kind) {
    case "ClazzNull": {
      if (args.length !== 0) {
        throw new ElaborationError(`too many property in NewNameless`)
      } else {
        return {}
      }
    }

    case "ClazzCons": {
      if (args.length === 0) {
        throw new ElaborationError(`missing property in NewNameless`)
      } else {
        const [arg, ...restArgs] = args
        const core = check(ctx, arg.exp, clazz.propertyType)
        const value = evaluate(ctxToEnv(ctx), core)
        const rest = Values.applyClosure(clazz.restClosure, value)
        assertClazzInCtx(ctx, rest)
        ctx = CtxCons(clazz.name, clazz.propertyType, ctx)
        return {
          [clazz.name]: core,
          ...checkNewNameless(ctx, restArgs, rest),
        }
      }
    }

    case "ClazzFulfilled": {
      const value = clazz.property
      const core = readback(ctx, clazz.propertyType, value)

      return {
        [clazz.name]: core,
        ...checkNewNameless(ctx, args, clazz.rest),
      }
    }
  }
}
