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
