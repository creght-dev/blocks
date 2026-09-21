import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT_DIR = process.cwd()
const allowedTargets = new Set(["public/r"])
const target = process.argv[2]?.replaceAll("\\", "/").replace(/^\.\//, "")

if (!target || !allowedTargets.has(target)) {
  console.error(`Refusing to clean unexpected registry output: ${target ?? "<missing>"}`)
  process.exit(1)
}

const outputPath = path.join(ROOT_DIR, target)
await fs.rm(outputPath, { recursive: true, force: true })
await fs.mkdir(outputPath, { recursive: true })
console.log(`Cleaned generated registry output: ${target}`)
