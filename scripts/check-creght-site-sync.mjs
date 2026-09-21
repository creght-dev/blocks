import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..")
const REGISTRY_ROOT = path.join(ROOT_DIR, "registry", "creght")
const SITE_ROOT = path.join(
  ROOT_DIR,
  "apps",
  "creght-site",
  "components",
  "sections",
)
const SOURCE_EXTENSIONS = new Set([".css", ".ts", ".tsx"])
const STRICT = process.argv.includes("--strict")

async function walkSourceFiles(rootDir, currentDir = rootDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkSourceFiles(rootDir, absolutePath)))
      continue
    }
    if (!entry.isFile() || !SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      continue
    }
    files.push(path.relative(rootDir, absolutePath).split(path.sep).join("/"))
  }

  return files.sort((a, b) => a.localeCompare(b))
}

function normalizeWhitespace(content) {
  return content
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trimEnd()
}

function printGroup(title, entries) {
  console.log(`\n${title} (${entries.length})`)
  for (const entry of entries) console.log(`  ${entry}`)
}

async function main() {
  const [registryFiles, siteFiles] = await Promise.all([
    walkSourceFiles(REGISTRY_ROOT),
    walkSourceFiles(SITE_ROOT),
  ])
  const registrySet = new Set(registryFiles)
  const siteSet = new Set(siteFiles)
  const commonFiles = siteFiles.filter((file) => registrySet.has(file))
  const registryOnly = registryFiles.filter((file) => !siteSet.has(file))
  const siteOnly = siteFiles.filter((file) => !registrySet.has(file))
  const exact = []
  const whitespaceOnly = []
  const contentDrift = []

  for (const relativePath of commonFiles) {
    const [registryContent, siteContent] = await Promise.all([
      fs.readFile(path.join(REGISTRY_ROOT, relativePath), "utf8"),
      fs.readFile(path.join(SITE_ROOT, relativePath), "utf8"),
    ])

    if (registryContent === siteContent) {
      exact.push(relativePath)
    } else if (
      normalizeWhitespace(registryContent) === normalizeWhitespace(siteContent)
    ) {
      whitespaceOnly.push(relativePath)
    } else {
      contentDrift.push(relativePath)
    }
  }

  console.log("Creght hosted-site source sync report")
  console.log(`  Registry source files: ${registryFiles.length}`)
  console.log(`  Hosted-site source files: ${siteFiles.length}`)
  console.log(`  Exact copies: ${exact.length}`)
  console.log(`  Whitespace-only differences: ${whitespaceOnly.length}`)
  console.log(`  Content drift: ${contentDrift.length}`)
  console.log(`  Registry-only files: ${registryOnly.length}`)
  console.log(`  Hosted-site-only files: ${siteOnly.length}`)

  printGroup("Content drift to review", contentDrift)
  printGroup("Whitespace-only differences", whitespaceOnly)
  printGroup("Registry files not mirrored to the hosted site", registryOnly)
  printGroup("Hosted-site files without a registry counterpart", siteOnly)

  if (STRICT && (contentDrift.length > 0 || siteOnly.length > 0)) {
    console.error(
      "\nStrict sync check failed. Reconcile content drift and hosted-site-only section sources before enabling this check in CI.",
    )
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error("Failed to inspect Creght hosted-site source sync")
  console.error(error)
  process.exitCode = 1
})
