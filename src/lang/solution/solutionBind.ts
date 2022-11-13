import { Solution } from "../solution"
import { Value } from "../value"

export function solutionBind(
  solution: Solution,
  name: string,
  value: Value,
): Solution {
  solution.bindings.set(name, value)
  return solution
}