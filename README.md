# Creght Blocks

Creght Blocks provides reusable page section components for websites, product pages, landing pages, and similar scenarios. Components are published as [shadcn registry](https://ui.shadcn.com/docs/registry/getting-started) JSON and can be installed into any React project configured with shadcn using the official CLI.

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

## License

MIT

## Design Studies

`landing-ai-seo` and its section entries are a from-scratch React/Tailwind source implementation informed by the layout and interaction patterns of the [Free AI Startup Website Kit](https://lime-arrow-820805.framer.app/). At the user's direction, matching reference images, the animated mark, and Inter font files are temporarily stored in `public/assets/ai-seo-source/` for visual parity. Confirm that you have permission to use them and replace or re-license them before production. No generated Framer page code is embedded or reused.

When installing an AI SEO section into another app, also copy `public/assets/ai-seo-source/` to that app's `public/assets/ai-seo-source/` directory and keep the matching Inter `@font-face` declarations from `src/globals.css`. The media directory is included in this package so the block can be moved without hotlinking the reference site.
