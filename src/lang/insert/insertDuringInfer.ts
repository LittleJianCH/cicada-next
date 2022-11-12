import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { freeNames } from "../exp"
import { Inferred } from "../infer"
import { applyInsertion, solveByArgs } from "../insert"
import { Mod } from "../mod"

export function insertDuringInfer(
  mod: Mod,
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
): Inferred {
  const argFreeNames = new Set(
    args.flatMap((arg) => Array.from(freeNames(new Set(), arg.exp))),
  )

  const solved = solveByArgs(mod, ctx, argFreeNames, inferred.type, args)

  let core = inferred.core

  for (const insertion of solved.insertions) {
    core = applyInsertion(mod, ctx, insertion, core)
  }

  return Inferred(solved.type, core)
}