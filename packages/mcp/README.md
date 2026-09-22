# @steelbook/mcp

An [MCP](https://modelcontextprotocol.io) server that gives coding agents the Steelbook design system: every component with its props, examples and Figma contract, every design token in every mode, every icon's exact SVG, the house rules, and the same CSS gate CI runs.

The goal is that an agent asked to "build a settings page with Steelbook" reaches for the real `Button`, `Field` and `Switch`, styles only with `var(--sb-*)` tokens, keeps state in CSS, and can check its own work before a human sees it.

## Connect

The server is published two ways. Both serve the same catalog.

**Hosted (Streamable HTTP)** — nothing to install:

```
https://steelbook-mcp.vercel.app/mcp
```

**Local (stdio)** — runs from npm:

```
npx -y @steelbook/mcp
```

### Claude Code

```bash
claude mcp add --transport http steelbook https://steelbook-mcp.vercel.app/mcp
```

or, for the local server:

```bash
claude mcp add steelbook -- npx -y @steelbook/mcp
```

### Claude Desktop, Cursor, Windsurf, VS Code

Add to the client's MCP configuration (`claude_desktop_config.json`, `.cursor/mcp.json`, `.vscode/mcp.json`, …):

```json
{
  "mcpServers": {
    "steelbook": { "url": "https://steelbook-mcp.vercel.app/mcp" }
  }
}
```

or

```json
{
  "mcpServers": {
    "steelbook": { "command": "npx", "args": ["-y", "@steelbook/mcp"] }
  }
}
```

VS Code uses `"servers"` instead of `"mcpServers"` and `"type": "http"` / `"type": "stdio"`. Claude Desktop currently takes the stdio form.

### MCP registry

Listed as `io.github.m0rteum/steelbook`, so clients that browse the registry can add it by name.

## What the agent gets

The server's instructions tell an agent to start with `steelbook_get_started`; that tool returns the non-negotiables, the workflow and a tool map. From there:

| Tool | What it answers |
|---|---|
| `steelbook_get_started` | What Steelbook is, the rules, which tool to call for what |
| `steelbook_get_setup` | Wiring an app: tokens stylesheet, the Archivo variable font, `data-theme`, first render |
| `steelbook_get_guidelines` | CLAUDE.md and README sections by id: focus ring, disabled skin, fluid width, known gaps… |
| `steelbook_list_components` | The 51 components with a summary, primitive (Ark UI or native) and Figma node |
| `steelbook_get_component` | Import, props with types and defaults, JSDoc examples, the Figma description (the binding contract, with its `CODE:` block), CSS classes and tokens consumed, Storybook ids |
| `steelbook_search` | "Is there something for …" across components, tokens, icons and guidelines |
| `steelbook_list_tokens` / `steelbook_get_token` | The 285 `--sb-*` tokens with light/dark and desktop/mobile values, alias chains and which components use each |
| `steelbook_find_token` | Raw value → token (`#ff4d00` → `--sb-border-focus`); says when a value has no token so the gap gets flagged instead of hardcoded |
| `steelbook_list_icons` / `steelbook_get_icon` | The 40 exported icons with verbatim path data, plus the 165 Figma icon sets not exported yet |
| `steelbook_lint_css` | Runs the repository's Stylelint token gate on a snippet, with a fix hint per violation |
| `steelbook_review_usage` | Static review of JSX: `state` props, raw values in inline styles, hand-drawn `<svg>`, icon-only controls without a name, missing required props |

Resources expose the same data by URI (`steelbook://components/Button`, `steelbook://tokens.css`, `steelbook://icons/chevron-down.svg`, `steelbook://guidelines/rules/non-negotiables`, `steelbook://catalog.json`), and two prompts — `build-with-steelbook` and `review-steelbook-code` — package the workflow.

Every tool is read-only. Responses are Markdown by default with `structuredContent` alongside; list tools paginate with `limit` / `offset` / `next_offset`.

## How it stays true

The server never reads the filesystem at runtime. It serves `data/catalog.json`, which `scripts/build-catalog.ts` generates from the repository:

| Source | What is extracted |
|---|---|
| `packages/react/src/<name>/<Name>.tsx` | Exports, props (type, required, `@default`), JSDoc, `@example` blocks, the Figma node id, the Ark primitive imported |
| `packages/react/src/<name>/<Name>.css` | Class names, tokens consumed, component-local custom properties |
| `packages/react/src/<name>/<Name>.stories.tsx` | Storybook title and story ids |
| `packages/react/src/icons/*.tsx` | SVG markup with path data verbatim |
| `packages/tokens/tokens.css` | Every token, per mode, resolved through its aliases |
| `CLAUDE.md`, `README.md` | Guideline sections |
| `data/figma.json` | Component descriptions, properties and variants from the Figma file |
| `stylelint.config.mjs` | Copied verbatim so `steelbook_lint_css` enforces exactly what CI does |

`data/figma.json` is a snapshot of the Figma file taken with the Figma MCP (component descriptions, properties, variant counts, frame sizes, icon sets). Refresh it when descriptions change — they are the contract.

```bash
pnpm --filter @steelbook/mcp build:catalog   # regenerate data/catalog.json
pnpm --filter @steelbook/mcp test            # fails if catalog.json is stale
```

The freshness test runs as part of `pnpm test` at the repo root, so a component change that forgets to rebuild the catalog fails CI.

## Develop

```bash
pnpm --filter @steelbook/mcp dev       # stdio server from source
pnpm --filter @steelbook/mcp serve     # http://localhost:3333/mcp
pnpm --filter @steelbook/mcp inspect   # MCP Inspector against the stdio server
pnpm --filter @steelbook/mcp build     # data/catalog.json + dist/
```

Set `STEELBOOK_STORYBOOK_URL` to a deployed Storybook and component responses link straight to each story.

## Publish

Three things, in this order. The first two need the maintainer's credentials.

1. **npm** — push a tag `mcp-v<version>` (matching `package.json` and `server.json`) and the [publish workflow](../../.github/workflows/publish-mcp.yml) builds, verifies and publishes with provenance. It needs an `NPM_TOKEN` repository secret (an npm automation token for the `@steelbook` scope). To do it by hand instead:

   ```bash
   cd packages/mcp && pnpm build && npm publish --access public
   ```

2. **MCP registry** — the same workflow runs `mcp-publisher` with GitHub OIDC. By hand:

   ```bash
   cd packages/mcp && mcp-publisher login github && mcp-publisher publish
   ```

3. **Hosted endpoint** — import the repo into Vercel with the root directory set to `packages/mcp`. `vercel.json` routes `/` and `/mcp` to the function in `api/mcp.ts`; nothing else to configure. Any other host that runs a Node `(req, res)` listener or a Web-standard `fetch` handler works too: both are exported from `@steelbook/mcp/http`.

## Layout

```
packages/mcp/
  src/server.ts        tools, resources, prompts — the whole MCP surface
  src/catalog.ts       loads data/catalog.json, lookups and "did you mean"
  src/format.ts        Markdown renderers, pagination, response helpers
  src/lint.ts          steelbook_lint_css over the repo's Stylelint config
  src/review.ts        steelbook_review_usage heuristics
  src/docs.ts          overview, setup and workflow text
  src/stdio.ts         `steelbook-mcp` bin
  src/http.ts          stateless Streamable HTTP handler (+ Node listener)
  src/serve.ts         local HTTP server
  api/mcp.ts           Vercel function
  scripts/build-catalog.ts
  data/catalog.json    generated — commit it
  data/figma.json      Figma snapshot
  data/stylelint.config.mjs   generated copy
  test/                MCP client tests and the catalog freshness test
  server.json          MCP registry manifest
```
