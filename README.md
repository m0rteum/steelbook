# Steelbook

A React design system built from a Figma file — 50 components, 34 icons, and 329 design tokens, with the drawing as the specification.

[![CI](https://github.com/m0rteum/steelbook/actions/workflows/ci.yml/badge.svg)](https://github.com/m0rteum/steelbook/actions/workflows/ci.yml)

## Figma is the source of truth

This is the premise the whole repo is built on, and it is stricter than it sounds. Code implements what the design specifies; it does not invent, improve, or reinterpret it. Where the design is silent, the gap gets flagged rather than filled in.

**[Steelbook Design System](https://www.figma.com/design/h612G7BPMLOPKHKKGec18l/Steelbook-Design-System)** — the file itself.

Three things follow from that premise:

**The component description is the contract.** Every component in the Figma file carries a description naming the primitive to build on, how Figma properties map to props, and what the defaults are. Descriptions change, so on any update task they get re-read and diffed against the implementation — a change there is as real as a change in geometry. Canvas annotations carry build-time context; the description wins on conflict.

**Every value resolves through a token.** No hex, no raw px, no font declarations in component CSS — only `var(--sb-*)` from `packages/tokens/tokens.css`. If the design uses a value with no token behind it, that gets flagged rather than hardcoded or snapped to the nearest neighbour. This is enforced, not encouraged: `pnpm lint:css` fails CI on a violation.

**State variants are CSS, not props.** Figma models Hover / Active / Focus / Disabled as variant axes because it has no other way to draw them. In code they are `:hover`, `:active`, `:focus-visible`, and the native `disabled` attribute. No component exposes a `state` prop, and each one ships a compile-time test that fails if it ever grows one.

## Layout

```
packages/
  tokens/      tokens.css — the generated token layer, 329 custom properties
  react/       @steelbook/react — components, icons, stories, type tests
```

`packages/tokens/tokens.css` is generated from the Figma variable collections — Primitives (83), Color (56, Light/Dark), Layout (21) and Text (48, Desktop/Mobile) — and is not hand-edited. It resolves in two layers: primitives hold the raw scales (`--sb-gray-700`, `--sb-space-5`), and a semantic layer aliases them by role (`--sb-text-secondary`, `--sb-gap-sm`, `--sb-border-focus`). Components reach for the semantic name wherever one carries the meaning, and fall through to a primitive only where the semantic layer has no entry for what is being drawn — a spacing step with no gap token, or Color Picker's thumb rings, which stay white over the gradient in either theme.

Each component follows one shape:

```
packages/react/src/<name>/
  <Name>.tsx           the component
  <Name>.css           its styles, tokens only
  <Name>.stories.tsx   drawn at the Figma frame's size, so it can be measured against the file
  <Name>.test-d.tsx    compile-time contract — tsc --noEmit is the assertion
  index.ts
```

## Getting started

Requires [pnpm](https://pnpm.io) 11.22+. CI runs Node 22.

```bash
pnpm install
```

Run Storybook — every component has stories, drawn at the size the Figma frame uses so rendered output can be checked against the file:

```bash
pnpm --filter @steelbook/react storybook
```

## Using it

The package is consumed from source. `@steelbook/react` exports `./src/index.ts` directly rather than a build artifact, so there is no build step and no publish — add it as a workspace dependency and let the consuming app's bundler handle TypeScript and CSS.

The token layer is a bare stylesheet rather than a package, so it is imported by path. Storybook does the same thing in [`.storybook/preview.tsx`](packages/react/.storybook/preview.tsx).

```tsx
import '../../tokens/tokens.css'
import { Button, Dialog, Field } from '@steelbook/react'

<Field label="Email address" placeholder="you@company.com" />
<Button tone="primary" size="md">Save</Button>
```

Components are fluid by default — they fill their container. Frame sizes on the canvas are layout convenience, not a specification. The exceptions are surfaces that genuinely own a width (Dialog, Menu, Popover, Toast and the other overlays), which carry it as a local custom property and say so in their CSS.

### Fonts are a hard requirement

Archivo **must** load as a variable font. Steelbook's type scale drives the `wdth` axis through `font-stretch`, and against a static Archivo that silently does nothing — text renders at the wrong width with no error anywhere.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400..700&display=swap">
```

### Theming

Dark mode keys off a `data-theme` attribute. Every semantic colour token is redefined under it:

```html
<html data-theme="dark">
```

Typography is responsive at **768px** — below it the Text collection's Mobile mode applies, and only the seven display and heading sizes flip. Body, label and mono are identical in both modes deliberately: 16px body stays 16px, because shrinking it hurts readability and trips iOS input auto-zoom.

## Verification

Three gates, run from the repo root. Each fans out across the workspaces with `pnpm -r`, and CI runs the same three on every pull request and on push to `main`.

```bash
pnpm typecheck && pnpm test && pnpm lint:css
```

`lint:css` is the interesting one. It is a custom Stylelint configuration that treats raw values as build errors: no hex or `rgb()` in any colour property, no bare lengths in spacing / sizing / radius / border properties, and no typography that does not come from an `--sb-text-*` group. `calc()` is allowed so long as every term inside it is a token. Class names must match `sb-<block>__<element>--<modifier>`, and component-local custom properties must be `--sb-` prefixed so they cannot be mistaken for design tokens.

`packages/tokens/**` is the one place raw values are legal, and it is ignored by the linter.

## House patterns

**Ark UI supplies behavior.** Where a component description names an [Ark](https://ark-ui.com) primitive, the component builds on it rather than reimplementing keyboard handling, focus management, or ARIA. Styling hangs off Ark's `data-*` attributes (`data-state`, `data-disabled`, `data-hover`), never off React state. Where the description says there is no Ark primitive, the native element is used.

**The focus ring is one thing.** `--sb-stroke-heavy` (3px) in `--sb-border-focus`, never another width, never another colour. It is placed one of three ways — inset by default so the frame cannot grow on focus; as a completed band where the component's own stroke already reaches the frame edge (Button and Switch pair a 2px border with a 1px outline to read as one 3px band at no layout cost); or outset in the narrow case where insetting would swallow the control's own fill.

**Icon-only controls must carry an accessible name.** No visible text means no accessible name, and no library can supply one. It is enforced at the type level with a mutually exclusive `aria-label` / `aria-labelledby` union, and decorative glyphs are marked `aria-hidden="true"`.

**Reuse, never regenerate.** If a component exists, import it. If something close exists, extend it. A second version of an existing component is a defect, not a shortcut.

**Assets come from Figma.** Icons are the exported SVG with path data preserved verbatim, recoloured through `currentColor` so tokens drive the fill. Nothing is redrawn from memory.

## Known gaps

These are documented rather than worked around silently.

- **Font family, weight, and the Archivo width axis are not readable from Figma's API.** They live in text style descriptions and in `tokens.css`. Changing one means changing both, and nothing detects the drift.
- **The 768px breakpoint exists only in `tokens.css`.** No Figma variable holds it.
- **Code Connect is unavailable on this Figma plan.** Component descriptions carry the code mapping instead, in a `CODE:` block.
- **Figma paints children over a parent's inside stroke.** A frame with a 12px inset and a 2px inside stroke puts its child 12px from the frame edge, not 14px. CSS `border` sits outside `padding`, so reproducing the drawing takes `calc(<inset> - var(--sb-stroke-default))` — which is why that expression recurs throughout the component CSS.
- **Browsers floor `border-width` to whole device pixels.** A 1.5px stroke paints at 1px on a 1x display and 1.5px on a 2x display, so a sub-pixel stroke cannot be relied on to draw as specified.

## Contributing

[`CLAUDE.md`](CLAUDE.md) is the working agreement — the binding version of everything above, plus the conventions that govern changes. Read it before opening a pull request.

The short version: change what was asked and what that change requires. Unrequested refactors, reformatting and drive-by improvements are noise in review — raise them instead. If something outside scope looks wrong, say so and let a human decide.
