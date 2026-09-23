# Creght Blocks

Creght Blocks provides reusable page section components for websites, product pages, landing pages, and similar scenarios. Components are published as [shadcn registry](https://ui.shadcn.com/docs/registry/getting-started) JSON and can be installed into any React project configured with shadcn using the official CLI.

## Public Registry

Published component entries are generated from `registry/creght/` into `registry.json` and `public/r`. There is no private sibling repository, entitlement lookup, or token-protected download in the current phase.

All blocks use the same public install and copy flow; there are no access tiers or Pro gates. Run `npm run registry:build` to rebuild the complete public registry.

## Configure Registry

Add the `registries` configuration to `components.json` in the consuming project:

```json
{
  "registries": {
    "@creght-blocks": "https://unpkg.com/@creght/creght-blocks@latest/public/r/{name}.json"
  }
}
```

After configuration, entries can be referenced with `@creght-blocks/<name>`. The `{name}` placeholder maps to the published registry JSON for that entry.

## Install in a Project

Package name: `@creght/creght-blocks`

**Install with the registry alias:**

```bash
npx shadcn@latest add @creght-blocks/hero-01
```

**Install with the full URL:**

```bash
npx shadcn@latest add https://unpkg.com/@creght/creght-blocks@latest/public/r/hero-01.json
```

**Add from the full registry index, depending on whether your local shadcn version supports a registry root URL:**

```bash
npx shadcn@latest add https://unpkg.com/@creght/creght-blocks@latest/public/r/registry.json
```

If `unpkg` is delayed, replace `latest` with a published semver version.

## Install with the Package CLI

Every block can also be installed with the package CLI, without a token:

```bash
npx @creght/creght-blocks add hero-lodestar
```

The installer accepts the same options as `shadcn add`, for example `--yes`, `--overwrite`, `--cwd`, and `--path`.

## License

The repository is MIT licensed. Individual third-party study assets or attributed source portions may carry additional permission requirements documented below.

## Design Studies

`landing-ai-seo` and its sections remain in this repository for the standalone page demo but are excluded from the Blocks catalog and installable registry. They are a from-scratch React/Tailwind source implementation informed by the layout and interaction patterns of the [Free AI Startup Website Kit](https://lime-arrow-820805.framer.app/). The demo references its images, video, and Inter fonts through the Creght CDN. Confirm that you have permission to use them and replace or re-license them before production. No generated Framer page code is embedded or reused.

`hero-flip` and `stack-scroll` use the shared generated images and font assets hosted on the Creght CDN. Installed blocks do not require copying an asset directory into the consuming project. Earlier reference images and unused fonts have been removed.

`infinite-canvas` and `scramble-glitch` load their default images from the Creght CDN. The three custom JPG originals in `public/assets/infinite-canvas/` are retained for maintaining the CDN assets; they are not required in the npm package.

`hero-lodestar` now includes a source-based particle port from [ricardochance.com](https://www.ricardochance.com/), requested explicitly for visual reproduction. The original star mesh and GLSL are attributed in `lodestar-source.ts`; the renderer adapts the source's surface sampling, orthographic projection, twinkle, pointer tilt, repulsion, and background trail to a standalone React component. The existing demo copy and brand remain customizable. Public availability is not a license grant: the third-party source portions require appropriate permission before redistribution or commercial use and are not represented as original MIT-licensed code.

`showcase-3d` is a React/CSS source reconstruction of the [Rotating 3D Showcase](https://3d-showcase.learnframer.site/) interaction. Its default portrait imagery is loaded from the reference page's public Framer CDN URLs for parity; replace or re-license those defaults before production use if you do not control the source assets.

`unroll-scroll` is a React/CSS source reconstruction of the [Image Unroll Scroll](https://unroll-scroll.learnframer.site/) interaction. Its four reference images and matching font files are served from the Creght CDN; confirm reuse permission or replace them before production use.

`button-gradient-border` is a React/CSS/canvas reconstruction of the animated button from [Gradient Border Button Component](https://gradient-border-v2.learnframer.site/). It uses a Satoshi Bold font file served from the Creght CDN. Confirm that you have permission to use it before production.

## Creght Hosted Site

The Creght-hosted Blocks library has a local working copy in `apps/creght-site/`.
This directory and `apps/ai-seo-creght-template/` are ignored by Git; their local
files and Creght sync state are retained for maintenance. The Blocks copy's
`.creght/state.json` binds it to project `p35l7ulie6he` and site `p35l7ulpwviq`.
The commands below use that existing local working copy.

```bash
npm run site:pull
npm run site:sync:report
npm run site:diff
npm run site:push
npm run site:preview
```

`registry/creght/` remains the canonical source for distributable blocks.
Before pushing the hosted site, pull remote editor changes, review the source
sync report, and inspect `site:diff`. See
[`docs/creght-site-management.md`](docs/creght-site-management.md) for the
ownership rules and the new-section checklist.
