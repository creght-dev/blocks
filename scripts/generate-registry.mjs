import { promises as fs } from "node:fs"
import path from "node:path"

const ROOT_DIR = process.cwd()
const REGISTRY_ROOT = path.join(ROOT_DIR, "registry", "creght")
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json")
const CATALOG_OUTPUT_PATH = path.join(ROOT_DIR, "registry.catalog.json")
const COVERS_DIR = path.join(ROOT_DIR, "public", "covers")
const CDN_ASSET_MANIFEST_PATH = path.join(ROOT_DIR, "scripts", "creght-cdn-assets.json")

const SCHEMA_URL = "https://ui.shadcn.com/schema/registry.json"
const REGISTRY_NAME = "creght"
const HOMEPAGE_URL = "https://github.com/creght-dev/blocks"
const CATEGORY_ORDER = ["hero", "features", "background", "effects", "showcase", "footer"]
const REGISTRY_SOURCE_EXTENSIONS = [".tsx", ".ts", ".css"]
// Keep the AI SEO page source for its standalone demo, but omit the page and its
// sections from the distributable Blocks registry.
const UNLISTED_ITEMS = new Set([
  "landing-ai-seo",
  "navbar-ai-seo",
  "hero-ai-seo",
  "logo-wall-ai-seo",
  "features-ai-seo",
  "feature-list-ai-seo",
  "testimonials-ai-seo",
  "pricing-ai-seo",
  "cta-ai-seo",
  "footer-ai-seo",
])
const COVER_OVERRIDES = {
  "rainbow-stretching-footer": "https://fsu.creght.com/site/2081689097969078272/1785148393646__rainbow_footer.png",
  "timeline-01": "https://fsu.creght.com/project/mDzERvIUUmW/lZKFrnwKLQS__area.gif",
}
const TITLE_OVERRIDES = {
  "ai-liquid-background": "Background · AI Liquid",
  "neuro-noise": "Background · Neuro Noise",
  "3d-split": "Effects · 3D Split",
  "cards-expand": "Effects · Cards Expand",
  "image-carousel": "Effects · Image Carousel",
  "image-intro": "Effects · Image Intro",
  "inner-globe": "Effects · Inner Globe",
  "hero-flip": "Hero · Photography Portfolio",
  "hero-orb-particles": "Hero · Orb Particles",
  "rainbow-stretching-footer": "Footer · Rainbow Stretching",
  "sphere-wall": "Effects · Sphere Wall",
  "stack-scroll": "Effects · Stack Scroll",
  "scramble-glitch": "Showcase · Scramble Glitch",
  "infinite-canvas": "Showcase · Infinite Canvas",
  "showcase-3d": "Showcase · Rotating 3D",
  "unroll-scroll": "Showcase · Image Unroll Scroll",
  "button-generate": "Button · 05",
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

function readArgument(name) {
  const prefix = `${name}=`
  const inline = process.argv.find((argument) => argument.startsWith(prefix))
  if (inline) return inline.slice(prefix.length)

  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function resolveBuildOptions() {
  const defaultOutput = path.join(ROOT_DIR, "registry.json")
  const requestedOutput = readArgument("--output")

  return {
    outputPath: requestedOutput
      ? path.resolve(ROOT_DIR, requestedOutput)
      : defaultOutput,
  }
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
    .filter((name) => REGISTRY_SOURCE_EXTENSIONS.some((extension) => name.endsWith(extension)) && !name.endsWith(".d.ts"))
    .sort((a, b) => a.localeCompare(b))
}

function isEntryFileName(fileName, itemName) {
  const normalized = fileName.toLowerCase()
  return normalized === `${itemName.toLowerCase()}.tsx` || normalized === `${itemName.toLowerCase()}.ts`
}

function sortFilesWithEntryFirst(files, itemName) {
  const matchedPreferred = files.find((name) => isEntryFileName(name, itemName))
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
    if (!REGISTRY_SOURCE_EXTENSIONS.some((extension) => normalized.endsWith(extension))) continue

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
  const entryFile = filePaths.find(
    (filePath) => path.dirname(filePath) === itemDir && isEntryFileName(path.basename(filePath), itemName),
  )

  return [...filePaths].sort((a, b) => {
    if (a === entryFile) return -1
    if (b === entryFile) return 1
    return a.localeCompare(b)
  })
}

async function getCoverPath(itemName, cdnAssets) {
  if (COVER_OVERRIDES[itemName]) {
    return COVER_OVERRIDES[itemName]
  }

  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"]
  for (const ext of extensions) {
    const localPath = `/covers/${itemName}${ext}`
    if (cdnAssets[localPath]) {
      return cdnAssets[localPath]
    }

    const coverFile = path.join(COVERS_DIR, `${itemName}${ext}`)
    try {
      await fs.access(coverFile)
      return localPath
    } catch {
      // continue
    }
  }
  return undefined
}

async function generate() {
  const { outputPath } = resolveBuildOptions()
  const [packageJson, cdnAssetManifest] = await Promise.all([
    readJson(PACKAGE_JSON_PATH),
    readJson(CDN_ASSET_MANIFEST_PATH),
  ])
  const cdnAssets = cdnAssetManifest.assets ?? {}
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
      if (UNLISTED_ITEMS.has(itemName)) continue

      const itemDir = path.join(categoryDir, itemName)
      const files = await listFilesInDir(itemDir)
      if (files.length === 0) continue

      const hasEntryFile = files.some((fileName) => isEntryFileName(fileName, itemName))
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
          type: filePath.endsWith(".css") ? "registry:style" : "registry:component",
        })),
      }

      const cover = await getCoverPath(itemName, cdnAssets)
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

  const catalog = {
    name: REGISTRY_NAME,
    homepage: HOMEPAGE_URL,
    items,
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await Promise.all([
    fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf-8"),
    fs.writeFile(CATALOG_OUTPUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf-8"),
  ])
  console.log(
    `Generated ${path.relative(ROOT_DIR, outputPath)} with ${items.length} items.`,
  )
  console.log(`Generated registry.catalog.json with ${items.length} catalog items.`)
}

generate().catch((error) => {
  console.error("Failed to generate registry.json")
  console.error(error)
  process.exitCode = 1
})
