import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  Aperture,
  Atom,
  Boxes,
  CircleDotDashed,
  Cuboid,
  Gem,
  Hexagon,
  Infinity,
  Orbit,
  Sparkles,
  Triangle,
  Workflow,
} from "lucide-react"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outputDir = path.join(projectRoot, "public/assets/logo-wall/logos")
const manifestPath = path.join(projectRoot, "public/assets/logo-wall/logos.json")
const cdnAssetManifestPath = path.join(projectRoot, "scripts/creght-cdn-assets.json")
const cdnAssetManifest = JSON.parse(await readFile(cdnAssetManifestPath, "utf-8"))
const cdnAssets = cdnAssetManifest.assets ?? {}

const logos = [
  { name: "Northframe", slug: "northframe", icon: Aperture, sourceIcon: "Aperture" },
  { name: "Heliox", slug: "heliox", icon: Atom, sourceIcon: "Atom" },
  { name: "Cubera", slug: "cubera", icon: Boxes, sourceIcon: "Boxes" },
  { name: "Senzi", slug: "senzi", icon: CircleDotDashed, sourceIcon: "CircleDotDashed" },
  { name: "Quorix", slug: "quorix", icon: Cuboid, sourceIcon: "Cuboid" },
  { name: "Veldra", slug: "veldra", icon: Gem, sourceIcon: "Gem" },
  { name: "Hexora", slug: "hexora", icon: Hexagon, sourceIcon: "Hexagon" },
  { name: "Endly", slug: "endly", icon: Infinity, sourceIcon: "Infinity" },
  { name: "Orbia", slug: "orbia", icon: Orbit, sourceIcon: "Orbit" },
  { name: "Astera", slug: "astera", icon: Sparkles, sourceIcon: "Sparkles" },
  { name: "Triquo", slug: "triquo", icon: Triangle, sourceIcon: "Triangle" },
  { name: "Flowen", slug: "flowen", icon: Workflow, sourceIcon: "Workflow" },
]

await mkdir(outputDir, { recursive: true })

for (const logo of logos) {
  const markup = renderToStaticMarkup(
    createElement(logo.icon, {
      xmlns: "http://www.w3.org/2000/svg",
      width: 48,
      height: 48,
      color: "#e4e4e7",
      strokeWidth: 1.65,
      "aria-hidden": "true",
    }),
  )
  const svg = `${markup.replace(">", `><title>${logo.name}</title>`)}\n`
  await writeFile(path.join(outputDir, `${logo.slug}.svg`), svg)
}

const manifest = logos.map(({ name, slug, sourceIcon }) => ({
  name,
  slug,
  src:
    cdnAssets[`/assets/logo-wall/logos/${slug}.svg`] ??
    `/assets/logo-wall/logos/${slug}.svg`,
  alt: `${name} fictional placeholder logo`,
  sourceIcon,
}))

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Generated ${logos.length} logo-wall assets in ${outputDir}`)
