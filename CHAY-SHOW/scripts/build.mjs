import { cp, mkdir, rm, access } from 'node:fs/promises'
import { constants } from 'node:fs'

const src = new URL('../public/', import.meta.url)
const out = new URL('../dist/', import.meta.url)
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })
await cp(src, out, { recursive: true })
for (const file of ['index.html', 'app.js', 'data.js', 'styles.css']) {
  await access(new URL(file, out), constants.R_OK)
}
console.log('CHAY SHOW build PASS -> dist/')
