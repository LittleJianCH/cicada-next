import { Fetcher } from "../framework/fetcher"
import { Mod } from "../lang/mod"
import { createScript, Script } from "../script"

export class Loader {
  cache: Map<string, Script> = new Map()
  fetcher = new Fetcher()

  async load(url: URL, options?: { text?: string }): Promise<Mod> {
    const found = this.cache.get(url.href)
    if (found !== undefined) return found.mod

    const text = options?.text || (await this.fetcher.fetch(url))
    const mod = new Mod({ loader: this, url })
    const script = createScript(mod, text)
    await script.run()
    this.cache.set(url.href, script)
    return script.mod
  }
}
