import { check, checkType } from "../check"
import { evaluate } from "../evaluate"
import { Exp } from "../Exp"
import { Mod } from "../Mod"
import { Stmt } from "../Stmt"

export class Check extends Stmt {
  constructor(public name: string, public exp: Exp, public type: Exp) {
    super()
  }

  execute(mod: Mod): void {
    const typeCore = checkType(mod.ctx, this.type)
    const typeValue = evaluate(mod.env, typeCore)
    check(mod.ctx, this.exp, typeValue)
  }
}