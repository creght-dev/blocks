import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT_DIR = process.cwd()
const catalog = JSON.parse(
  await fs.readFile(path.join(ROOT_DIR, "registry.catalog.json"), "utf8"),
)
const registry = JSON.parse(
  await fs.readFile(path.join(ROOT_DIR, "registry.json"), "utf8"),
)
const builtRegistry = JSON.parse(
  await fs.readFile(path.join(ROOT_DIR, "public", "r", "registry.json"), "utf8"),
)

const catalogNames = new Set(catalog.items.map((item) => item.name))
const registryNames = new Set(registry.items.map((item) => item.name))
const builtNames = new Set(builtRegistry.items.map((item) => item.name))
const errors = []

for (const item of catalog.items) {
  if (!registryNames.has(item.name)) errors.push(`registry.json is missing ${item.name}`)
  if (!builtNames.has(item.name)) errors.push(`public/r/registry.json is missing ${item.name}`)

  try {
    await fs.access(path.join(ROOT_DIR, "public", "r", `${item.name}.json`))
  } catch {
    errors.push(`public/r is missing ${item.name}.json`)
  }
}

for (const itemName of registryNames) {
  if (!catalogNames.has(itemName)) errors.push(`registry.json contains unknown item ${itemName}`)
}

for (const itemName of builtNames) {
  if (!catalogNames.has(itemName)) errors.push(`public/r/registry.json contains unknown item ${itemName}`)
}

if (errors.length > 0) {
  console.error("Registry consistency check failed:")
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`Registry consistency check passed. ${catalog.items.length} items are public.`)
