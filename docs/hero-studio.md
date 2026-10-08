# Hero Studio MVP

Open `/hero-studio`; `/background-switcher` redirects to it. The library links to Hero Studio.

- Five foreground presets: centered / split AI input, the CreghtAI screenshot layout, and centered / split product mockup.
- Layouts live in the left rail. The header Preview button sits immediately left of Export and opens the selected layout at the full viewport size with its current content and background; close it to resume editing.
- Dark and light appearance groups keep layouts separate from color treatment. Switching groups selects a compatible background, remembers each group's latest selection during editing, and updates text, CTA, prompt, mockup, and overlay contrast. Existing drafts infer appearance from their selected background.
- Seven backgrounds: dark Cunda Rays, AI Liquid, Cargo Liquid, Neuro Noise, and Arc Flow; light Glass Ribbon and Soft Sky. Arc Flow uses the blue animated shader from the CreghtAI hero, with editable palette, curve, light, texture, and speed. Soft Sky uses the Replyo homepage's warm gradient, converging light rays, and animated particles, with editable palette, ray, glow, motion, and density. Each background has its own controls. Advanced controls are collapsed initially.
- Glass Ribbon uses inline SVG gradients and a clipped curved glass surface, with separate desktop and mobile compositions. Its palette, curve, warm glow, blur, and light bands are adjustable. Light-band motion is optional and follows reduced-motion preferences.
- Cargo Liquid ports the separate Cargo Effects Lab liquid gradient as a local WebGL shader, with its three-color palette, shape, distortion, and motion controls. It runs without the AI Liquid CDN runtime and is included in standalone exports.
- AI Liquid defaults to a pure black base. The base and fade use its configurable base color, while the default dark-highlight blend removes the animation runtime's gray matte and keeps the blue lines. Drafts with the previous `#050505` default colors migrate to this look.
- Text, CTA, prompt suggestions, and image URL editing. CreghtAI has its own editable brand, title, labels, and trust copy; selecting it initially applies Arc Flow. Switching layouts preserves content; changing backgrounds preserves every background's settings and contrast overlay. Background reset changes only the selected background; header reset restores the full initial composition. Older drafts with a single overlay value migrate without changing the appearance of their existing backgrounds.
- One same-origin preview iframe at a true 1200px or 390px viewport. Scaling fits the editor without changing breakpoints. Long hero content scrolls within the iframe.
- Local draft storage under `creght:hero-studio:v1`; malformed, out-of-range, or unknown saved values normalize to safe defaults. Storage failure leaves the editor usable and displays an unsaved status.
- Export includes selected background source, foreground source, mockup source, styles, fonts, and the current content/settings in one `GeneratedHero.tsx`. Requires React, Tailwind CSS v4, lucide-react; Cunda also requires ogl. Liquid's existing animation runtime and fonts load from the Creght CDN.
- Prompt interactions are explicitly a demo; no AI service or backend is connected. The default dashboard is a visual mockup. Failed custom images fall back to it with a message.

## Implementation

`src/lib/hero-studio-config.ts` owns defaults, layout/background catalogs, controls, normalization, and persistence loading. `HeroComposition` renders the validated config. `HeroForeground` is shared by preview and export. The export builder includes source via Vite raw imports and removes local imports, avoiding dependencies on this repository's path aliases.

Cunda's previous hardcoded settings are now optional props with preserved component defaults. Its renderer updates shader uniforms without rebuilding WebGL on each slider event and observes container resizing. The Cunda dashboard is extracted into a shared module; the original hero re-exports the same `DashboardPreview` interface.

## Checks

```bash
npm run build
node scripts/check-hero-studio.mjs
npx tsc -p artifacts/hero-studio/export-tsconfig.json
```

The export script checks malformed input, URL handling, storage round-trip, and all 35 layout/background exports. It writes disposable examples under ignored `artifacts/hero-studio/`. Existing root TypeScript project references have an independent composite/noEmit configuration problem; the app was checked with an equivalent temporary config with `references: []` and `incremental: false`. No production tsconfig changes were needed.
