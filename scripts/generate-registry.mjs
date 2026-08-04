import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT_DIR = process.cwd()
const REGISTRY_ROOT = path.join(ROOT_DIR, "registry", "creght")
const OUTPUT_PATH = path.join(ROOT_DIR, "registry.json")
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json")
const COVERS_DIR = path.join(ROOT_DIR, "public", "covers")

const SCHEMA_URL = "https://ui.shadcn.com/schema/registry.json"
const REGISTRY_NAME = "creght"
const HOMEPAGE_URL = "https://github.com/creght-dev/blocks"
const CATEGORY_ORDER = ["hero", "effects", "footer"]
const COVER_OVERRIDES = {
  "rainbow-stretching-footer": "https://fsu.creght.com/site/2081689097969078272/1785148393646__rainbow_footer.png",
  "timeline-01": "https://fsu.creght.com/project/mDzERvIUUmW/lZKFrnwKLQS__area.gif",
}
const TITLE_OVERRIDES = {
  "inner-globe": "Effects · Inner Globe",
  "rainbow-stretching-footer": "Footer · Rainbow Stretching",
  "sphere-wall": "Effects · Sphere Wall",
}

function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    const aRank = CATEGORY_ORDER.indexOf(a)
    const bRank = CATEGORY_ORDER.indexOf(b)
    const aOrder = aRank === -1 ? CATEGORY_ORDER.length : aRank
    const bOrder = bRank === -1 ? CATEGORY_ORDER.length : bRank
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.localeCompare(b)
  })
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

function toTitleCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

function formatTitleFromName(name, category) {
  const [, ...rest] = name.split("-")
  const prettyCategory = category
    ? toTitleCase(category)
    : "Section"
  const prettyName = rest.length > 0 ? rest
    .join(" ")
    : name
  const normalizedName = toTitleCase(prettyName)

  return normalizedName ? `${prettyCategory} · ${normalizedName}` : prettyCategory
}

function extractDependencies(content, knownDependencies) {
  const importRegex =
    /^import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["'];?/gm
  const deps = new Set()
  let match = importRegex.exec(content)

  while (match) {
    const source = match[1]
    if (!source.startsWith(".") && !source.startsWith("@/")) {
      const packageName = source.startsWith("@")
        ? source.split("/").slice(0, 2).join("/")
        : source.split("/")[0]

      if (
        packageName &&
        packageName !== "react" &&
        knownDependencies.has(packageName)
      ) {
        deps.add(packageName)
      }
    }
    match = importRegex.exec(content)
  }

  return [...deps].sort((a, b) => a.localeCompare(b))
}

async function listFilesInDir(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => (name.endsWith(".tsx") || name.endsWith(".ts")) && !name.endsWith(".d.ts"))
    .sort((a, b) => a.localeCompare(b))
}

function sortFilesWithEntryFirst(files, itemName) {
  const preferred = [`${itemName}.tsx`, `${itemName}.ts`]
  const matchedPreferred = preferred.find((name) => files.includes(name))
  if (!matchedPreferred) return files

  return [matchedPreferred, ...files.filter((file) => file !== matchedPreferred)]
}

function extractRelativeImports(content) {
  const importRegex = /^import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["'];?/gm
  const imports = []
  let match = importRegex.exec(content)

  while (match) {
    const source = match[1]
    if (source.startsWith(".")) {
      imports.push(source)
    }
    match = importRegex.exec(content)
  }

  return imports
}

async function resolveRelativeImport(fromFile, importSource) {
  const dir = path.dirname(fromFile)
  const candidates = [
    importSource,
    `${importSource}.tsx`,
    `${importSource}.ts`,
    path.join(importSource, "index.tsx"),
    path.join(importSource, "index.ts"),
  ]

  for (const candidate of candidates) {
    const resolved = path.normalize(path.join(dir, candidate))
    try {
      await fs.access(resolved)
      return resolved
    } catch {
      // try next candidate
    }
  }

  return null
}

async function collectTransitiveRegistryFiles(itemDir, initialFileNames) {
  const registryCreghtRoot = path.join(ROOT_DIR, "registry", "creght")
  const filePaths = new Set()
  const queue = initialFileNames.map((fileName) => path.join(itemDir, fileName))

  while (queue.length > 0) {
    const filePath = queue.shift()
    const normalized = path.normalize(filePath)

    if (filePaths.has(normalized)) continue
    if (!normalized.startsWith(registryCreghtRoot)) continue
    if (!normalized.endsWith(".ts") && !normalized.endsWith(".tsx")) continue

    try {
      await fs.access(normalized)
    } catch {
      continue
    }

    filePaths.add(normalized)
    const content = await fs.readFile(normalized, "utf-8")
    const imports = extractRelativeImports(content)

    for (const importSource of imports) {
      const resolved = await resolveRelativeImport(normalized, importSource)
      if (resolved) {
        queue.push(resolved)
      }
    }
  }

  return [...filePaths].sort((a, b) => a.localeCompare(b))
}

function sortRegistryFilePaths(filePaths, itemDir, itemName) {
  const entryTsx = path.join(itemDir, `${itemName}.tsx`)
  const entryTs = path.join(itemDir, `${itemName}.ts`)

  return [...filePaths].sort((a, b) => {
    if (a === entryTsx || a === entryTs) return -1
    if (b === entryTsx || b === entryTs) return 1
    return a.localeCompare(b)
  })
}

async function getCoverPath(itemName) {
  if (COVER_OVERRIDES[itemName]) {
    return COVER_OVERRIDES[itemName]
  }

  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"]
  for (const ext of extensions) {
    const coverFile = path.join(COVERS_DIR, `${itemName}${ext}`)
    try {
      await fs.access(coverFile)
      return `/covers/${itemName}${ext}`
    } catch {
      // continue
    }
  }
  return undefined
}

async function generate() {
  const packageJson = await readJson(PACKAGE_JSON_PATH)
  const knownDependencies = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ])

  const categoryEntries = await fs.readdir(REGISTRY_ROOT, { withFileTypes: true })
  const categories = sortCategories(
    categoryEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name),
  )

  const items = []

  for (const category of categories) {
    const categoryDir = path.join(REGISTRY_ROOT, category)
    const categoryChildren = await fs.readdir(categoryDir, { withFileTypes: true })
    const itemDirs = categoryChildren
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))

    for (const itemName of itemDirs) {
      const itemDir = path.join(categoryDir, itemName)
      const files = await listFilesInDir(itemDir)
      if (files.length === 0) continue

      const hasEntryFile = files.some(
        (fileName) => fileName === `${itemName}.tsx` || fileName === `${itemName}.ts`,
      )
      if (!hasEntryFile) continue

      const orderedFiles = sortFilesWithEntryFirst(files, itemName)
      const registryFilePaths = sortRegistryFilePaths(
        await collectTransitiveRegistryFiles(itemDir, orderedFiles),
        itemDir,
        itemName,
      )
      const allContents = await Promise.all(
        registryFilePaths.map((filePath) => fs.readFile(filePath, "utf-8")),
      )
      const dependencies = [
        ...new Set(
          allContents.flatMap((content) =>
            extractDependencies(content, knownDependencies),
          ),
        ),
      ].sort((a, b) => a.localeCompare(b))

      const itemTitle = TITLE_OVERRIDES[itemName] ?? formatTitleFromName(itemName, category)
      const item = {
        name: itemName,
        type: "registry:block",
        title: itemTitle,
        description: `${itemTitle} ${category === "button" ? "component" : "section"}.`,
        categories: [category || "section"],
        files: registryFilePaths.map((filePath) => ({
          path: path.relative(ROOT_DIR, filePath).split(path.sep).join("/"),
          type: "registry:component",
        })),
      }

      const cover = await getCoverPath(itemName)
      if (cover) {
        item.cover = cover
      }

      if (dependencies.length > 0) {
        item.dependencies = dependencies
      }

      items.push(item)
    }
  }

  const output = {
    $schema: SCHEMA_URL,
    name: REGISTRY_NAME,
    homepage: HOMEPAGE_URL,
    items,
  }

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf-8")
  // eslint-disable-next-line no-console
  console.log(`Generated registry.json with ${items.length} items.`)
}

generate().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to generate registry.json")
  // eslint-disable-next-line no-console
  console.error(error)
  process.exitCode = 1
})
