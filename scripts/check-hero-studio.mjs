import assert from "node:assert/strict"
import fs from "node:fs/promises"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { build, transform } from "esbuild"

const root = process.cwd()
const output = path.join(root, "artifacts/hero-studio")
await fs.mkdir(output, { recursive: true })
await build({
  stdin: {
    contents:
      'export * from "./src/lib/hero-studio-config"; export * from "./src/lib/hero-studio-export";',
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  packages: "external",
  outfile: path.join(output, "studio-check-bundle.mjs"),
  alias: { "@": root },
  plugins: [
    {
      name: "raw-source",
      setup(builder) {
        builder.onResolve({ filter: /\?raw$/ }, (args) => ({
          path: path.resolve(root, args.path.replace(/^@\//, "").replace(/\?raw$/, "")),
          namespace: "raw-source",
        }))
        builder.onLoad({ filter: /.*/, namespace: "raw-source" }, async (args) => ({
          contents: await fs.readFile(args.path, "utf8"),
          loader: "text",
        }))
      },
    },
  ],
})
const {
  DEFAULT_HERO_CONFIG,
  HERO_LAYOUTS,
  HERO_BACKGROUNDS,
  normalizeHeroConfig,
  buildHeroSource,
} = await import(pathToFileURL(path.join(output, "studio-check-bundle.mjs")))
assert.deepEqual(normalizeHeroConfig(null), DEFAULT_HERO_CONFIG)
assert.deepEqual(normalizeHeroConfig({ version: 999 }), DEFAULT_HERO_CONFIG)
const bad = normalizeHeroConfig({
  version: 1,
  layoutId: "missing",
  backgroundId: "missing",
  overlay: 200,
  content: {
    title: "A < B & {something} `quoted`",
    buttonHref: "javascript:alert(1)",
    imageUrl: "data:text/html,test",
  },
  backgrounds: {
    cunda: { speed: -100, intensity: Infinity, origin: "anywhere", rayColor1: "red" },
    liquid: { shape: "broken" },
    cargoLiquid: { shape: "broken", speed: 999, color2: "not-a-color" },
    glassRibbon: { curveHeight: 999, motionSpeed: Infinity, skyColor: "invalid" },
    arcFlow: { speed: 999, top: "invalid" },
    softSky: { particleCount: 999, particleSize: Infinity, accentColor: "invalid", animated: false },
    neuro: { complexity: 999, interactive: false },
  },
})
assert.equal(bad.overlays.cunda, 0.85)
assert.equal(bad.overlays.glassRibbon, 0.08)
assert.equal(bad.overlays.softSky, 0.02)
assert.equal(bad.backgrounds.cunda.speed, 0)
assert.equal(bad.backgrounds.cunda.intensity, DEFAULT_HERO_CONFIG.backgrounds.cunda.intensity)
assert.equal(bad.backgrounds.cunda.origin, "top-right")
assert.equal(bad.backgrounds.neuro.complexity, 15)
assert.equal(bad.backgrounds.neuro.interactive, false)
assert.equal(bad.backgrounds.cargoLiquid.shape, DEFAULT_HERO_CONFIG.backgrounds.cargoLiquid.shape)
assert.equal(bad.backgrounds.cargoLiquid.speed, 100)
assert.equal(bad.backgrounds.cargoLiquid.color2, DEFAULT_HERO_CONFIG.backgrounds.cargoLiquid.color2)
assert.equal(bad.backgrounds.glassRibbon.curveHeight, 100)
assert.equal(bad.backgrounds.glassRibbon.motionSpeed, DEFAULT_HERO_CONFIG.backgrounds.glassRibbon.motionSpeed)
assert.equal(bad.backgrounds.glassRibbon.skyColor, DEFAULT_HERO_CONFIG.backgrounds.glassRibbon.skyColor)
assert.equal(bad.backgrounds.arcFlow.speed, 4)
assert.equal(bad.backgrounds.arcFlow.top, DEFAULT_HERO_CONFIG.backgrounds.arcFlow.top)
assert.equal(bad.backgrounds.softSky.particleCount, 300)
assert.equal(bad.backgrounds.softSky.particleSize, DEFAULT_HERO_CONFIG.backgrounds.softSky.particleSize)
assert.equal(bad.backgrounds.softSky.accentColor, DEFAULT_HERO_CONFIG.backgrounds.softSky.accentColor)
assert.equal(bad.backgrounds.softSky.animated, false)
assert.equal(bad.content.buttonHref, "#")
assert.equal(bad.content.imageUrl, "")
assert.equal(bad.content.title, "A < B & {something} `quoted`")
assert.deepEqual(
  normalizeHeroConfig(JSON.parse(JSON.stringify(DEFAULT_HERO_CONFIG))),
  DEFAULT_HERO_CONFIG,
)
const legacyDraft = structuredClone(DEFAULT_HERO_CONFIG)
delete legacyDraft.overlays
legacyDraft.overlay = 0.31
assert.equal(normalizeHeroConfig(legacyDraft).overlays.cunda, 0.31)
assert.equal(normalizeHeroConfig(legacyDraft).overlays.neuro, 0.31)
assert.equal(normalizeHeroConfig(legacyDraft).overlays.glassRibbon, 0.08)
assert.equal(normalizeHeroConfig(legacyDraft).overlays.softSky, 0.02)
const lightDraft = structuredClone(DEFAULT_HERO_CONFIG)
lightDraft.backgroundId = "softSky"
delete lightDraft.appearance
assert.equal(normalizeHeroConfig(lightDraft).appearance, "light")
const oldSoftSkyDraft = structuredClone(DEFAULT_HERO_CONFIG)
oldSoftSkyDraft.backgrounds.softSky = {
  topColor: "#ffffff",
  bottomColor: "#829cff",
  glowColor: "#c6d3ff",
  rayOpacity: 0.48,
  sparkleOpacity: 0.72,
}
const migratedSoftSky = normalizeHeroConfig(oldSoftSkyDraft).backgrounds.softSky
assert.equal(migratedSoftSky.accentColor, "#829cff")
assert.equal(migratedSoftSky.warmColor, "#c6d3ff")
assert.equal(migratedSoftSky.particleOpacity, 0.72)
lightDraft.appearance = "dark"
assert.equal(normalizeHeroConfig(lightDraft).appearance, "light")
const oldLiquidDraft = structuredClone(DEFAULT_HERO_CONFIG)
oldLiquidDraft.backgrounds.liquid.color1 = "#050505"
oldLiquidDraft.backgrounds.liquid.color3 = "#050505"
oldLiquidDraft.backgrounds.liquid.blendMode = "screen"
assert.equal(normalizeHeroConfig(oldLiquidDraft).backgrounds.liquid.color1, "#000000")
assert.equal(normalizeHeroConfig(oldLiquidDraft).backgrounds.liquid.color3, "#000000")
assert.equal(normalizeHeroConfig(oldLiquidDraft).backgrounds.liquid.blendMode, "hard-light")
let count = 0
for (const layout of HERO_LAYOUTS) {
  for (const background of HERO_BACKGROUNDS) {
    const config = structuredClone(DEFAULT_HERO_CONFIG)
    config.layoutId = layout.id
    config.backgroundId = background.id
    config.overlays[background.id] = 0.37
    if (background.id === "glassRibbon") config.backgrounds.glassRibbon.motionSpeed = 0.5
    else if (background.id === "softSky") config.backgrounds.softSky.rayOpacity = 0.5
    else config.backgrounds[background.id].speed = 1.7
    if (layout.id === "sphere-ai") config.sphereContent.title = 'Hello "quoted" {orb}\n<script> & {braces} 🌱'
    else config.content.title = 'Hello "quoted"\n<script> & {braces} 🌱'
    const source = buildHeroSource(config)
    assert.match(source, /opacity: 0\.37/)
    if (layout.id === "sphere-ai") assert.match(source, /<HeroSphereAI className="hs-sphere-layout"/)
    else assert.ok(source.includes(`layoutId="${layout.id}"`))
    assert.ok(source.includes(background.id === "glassRibbon" ? '"motionSpeed": 0.5' : background.id === "softSky" ? '"rayOpacity": 0.5' : '"speed": 1.7'))
    assert.ok(source.includes(`className="hs-hero hs-${background.appearance}"`))
    if (layout.id !== "sphere-ai") assert.ok(source.includes(`appearance="${background.appearance}"`))
    if (background.appearance === "light") assert.match(source, /backgroundColor: "#ffffff"/)
    if (background.id === "cargoLiquid") assert.match(source, /const CARGO_LIQUID_FRAGMENT/)
    if (background.id === "arcFlow") assert.match(source, /function ArcFlowBackground/)
    if (background.id === "glassRibbon") assert.match(source, /function RibbonArtwork/)
    if (background.id === "softSky") {
      assert.match(source, /function SoftSkyBackground/)
      assert.match(source, /function ParticleBackground/)
      assert.match(source, /requestAnimationFrame/)
    }
    assert.doesNotMatch(source, /from ["'](?:@\/|\.\.\/|\.\/)/)
    await transform(source, { loader: "tsx", jsx: "automatic" })
    await fs.writeFile(path.join(output, `${layout.id}-${background.id}.tsx`), source)
    count++
  }
}
await fs.writeFile(
  path.join(output, "export-tsconfig.json"),
  JSON.stringify(
    {
      extends: "../../tsconfig.json",
      compilerOptions: { incremental: false },
      references: [],
      include: ["./*.tsx"],
    },
    null,
    2,
  ),
)
console.log(
  `Hero Studio checks passed: validation, safe URLs, persistence round-trip, and ${count} standalone exports. Export typecheck: npx tsc -p artifacts/hero-studio/export-tsconfig.json`,
)
