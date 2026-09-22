import { catalog, findGuideline } from './catalog.js'
import { STORYBOOK_URL } from './format.js'

const FONT_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400..700&display=swap">'

export function workflowMarkdown(): string {
  return `## The Steelbook workflow for agents

1. **Orient** — steelbook_get_started once; steelbook_get_guidelines section="rules/non-negotiables" if you have not read it this session.
2. **Reuse, never regenerate** — steelbook_list_components (or steelbook_search) before writing any UI. If a component exists, import it from \`@steelbook/react\`. If something close exists, extend it. A second version of an existing component is a defect.
3. **Read the contract** — steelbook_get_component for each component you use. Its Figma description (the CODE block) says which primitive it is built on, how Figma properties map to props, and the defaults. It wins over anything else.
4. **Tokens only** — every colour, length, radius, stroke and type value in CSS is \`var(--sb-*)\`. steelbook_find_token maps a raw value to its token; if nothing matches, flag the gap instead of hardcoding or snapping to the nearest token. Typography consumes a whole \`--sb-text-<style>-*\` group.
5. **State is CSS** — hover / active / focus / disabled are \`:hover\`, \`:active\`, \`:focus-visible\`, the \`disabled\` attribute, or Ark's \`data-*\` attributes. Never a prop.
6. **Accessible names** — icon-only controls need \`aria-label\` or \`aria-labelledby\`; decorative glyphs get \`aria-hidden="true"\`.
7. **Verify** — steelbook_lint_css on every stylesheet, steelbook_review_usage on the JSX, then \`pnpm typecheck && pnpm test && pnpm lint:css\` in the repo. Say which files changed and why.`
}

export function setupMarkdown(): string {
  const s = catalog.source
  return `# Setting up Steelbook

Steelbook is consumed **from source**: \`${s.reactPackage}\` exports \`./src/index.ts\` directly, so there is no build step and no npm publish. Add it as a workspace dependency and let your bundler handle TypeScript and CSS. It needs React 19+ and pulls in Ark UI ${s.arkVersion}.

Repository: ${s.repository}

## 1. Add the package (pnpm workspace)

\`\`\`json
// your app's package.json
{ "dependencies": { "@steelbook/react": "workspace:*" } }
\`\`\`

If your app lives outside the Steelbook monorepo, add the repo as a git submodule or a \`file:\` dependency pointing at \`packages/react\`; the package has no build artefacts to install.

## 2. Load the tokens

The token layer is a bare stylesheet, imported by path once at the app root:

\`\`\`tsx
import '<path-to-steelbook>/packages/tokens/tokens.css'
\`\`\`

It defines ${catalog.counts.tokens} custom properties (${catalog.counts.tokenDeclarations} declarations across light, dark and mobile). Components only ever read \`var(--sb-*)\`.

## 3. Load Archivo as a variable font — hard requirement

Steelbook drives Archivo's \`wdth\` axis through \`font-stretch\`. Against a static Archivo that silently does nothing and every heading renders at the wrong width with no error.

\`\`\`html
${FONT_LINK}
\`\`\`

## 4. Theme and breakpoint

Dark mode keys off an attribute; every semantic colour token is redefined under it:

\`\`\`html
<html data-theme="dark">
\`\`\`

Typography is responsive at **768px** (mobile below): only the seven display/heading sizes change. Body, label and mono stay identical on purpose.

## 5. First render

\`\`\`tsx
import { Button, Field } from '@steelbook/react'

<Field label="Email address" placeholder="you@company.com" />
<Button tone="primary" size="md">Save</Button>
\`\`\`

Components are fluid — they fill their container (\`inline-size: 100%\`). Overlays that own a width (Dialog, Menu, Popover, Toast, Drawer…) carry it as a local custom property.

## Verification gates

\`\`\`bash
pnpm typecheck && pnpm test && pnpm lint:css
\`\`\`

\`lint:css\` is the token gate; this server's steelbook_lint_css runs the identical configuration on a snippet.${
    STORYBOOK_URL ? `\n\nStorybook: ${STORYBOOK_URL}` : ''
  }`
}

export function overviewMarkdown(): string {
  const rules = findGuideline('rules/non-negotiables')?.body ?? ''
  return `# Steelbook

A React design system built from the Figma file "${catalog.source.figmaFile}" — ${catalog.counts.components} components, ${catalog.counts.icons} icons, ${catalog.counts.tokens} design tokens. **Figma is the source of truth**: code implements what the design specifies and does not invent, improve or reinterpret it. Where the design is silent, the gap is flagged, not filled.

- Figma: ${catalog.source.figmaUrl}
- Repository: ${catalog.source.repository}
- Behaviour: Ark UI ${catalog.source.arkVersion} where the component description names a primitive, the native element otherwise.
- Catalog built from commit \`${catalog.source.commit.slice(0, 7)}\` on ${catalog.generatedAt.slice(0, 10)}.

## Non-negotiables (from CLAUDE.md)

${rules}

${workflowMarkdown()}

## Tool map

| Need | Tool |
|---|---|
| Install / wire up an app | steelbook_get_setup |
| Which components exist | steelbook_list_components |
| Props, examples, Figma contract, CSS of one | steelbook_get_component |
| "Is there something for …" | steelbook_search |
| Browse tokens | steelbook_list_tokens |
| A token's values and consumers | steelbook_get_token |
| Raw value → token | steelbook_find_token |
| Icons in code (and Figma-only sets) | steelbook_list_icons / steelbook_get_icon |
| Rules and docs | steelbook_get_guidelines |
| Check CSS before shipping | steelbook_lint_css |
| Check JSX before shipping | steelbook_review_usage |

Resources: \`steelbook://overview\`, \`steelbook://tokens.css\`, \`steelbook://components/{name}\`, \`steelbook://icons/{glyph}.svg\`, \`steelbook://guidelines/{id}\`, \`steelbook://catalog.json\`. Prompts: \`build-with-steelbook\`, \`review-steelbook-code\`.`
}
