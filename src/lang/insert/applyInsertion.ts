import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Insertion } from "../insert"
import { Mod } from "../mod"
import { readback } from "../readback"
import { Solution, solutionLookupValue } from "../solution"

export function applyInsertion(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  insertion: Insertion,
  core: Core,
): Core {
  switch (insertion.kind) {
    case "InsertionMetaVar": {
      const argValue = solutionLookupValue(
        solution,
        insertion.metaVar.neutral.name,
      )

      if (argValue === undefined) {
        if (insertion.argExp !== undefined) {
          throw new Errors.ElaborationError(
            [
              `[applyInsertion] meet unsolved meta variable during infer`,
              `  variable name: ${insertion.metaVar.neutral.name}`,
              `  kind of next arg exp: ${insertion.argExp.kind}`,
            ].join("\n"),
            { span: insertion.argExp.span },
          )
        } else {
          throw new Errors.ElaborationError(
            [
              `[applyInsertion] meet unsolved meta variable during check`,
              `  variable name: ${insertion.metaVar.neutral.name}`,
            ].join("\n"),
            {},
          )
        }
      }

      const argCore = readback(
        mod,
        ctx,
        solution,
        insertion.metaVar.type,
        argValue,
      )
      return Cores.ApImplicit(core, argCore)
    }

    case "InsertionUsedArg": {
      return Cores.Ap(core, insertion.argCore)
    }

    case "InsertionImplicitArg": {
      return Cores.ApImplicit(core, insertion.argCore)
    }
  }
}
