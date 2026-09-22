/**
 * The hosted transport: stateless Streamable HTTP. Every request builds a
 * fresh server from the same catalog, so it scales horizontally and needs no
 * session store — the right shape for a serverless function.
 */
import { createMcpHandler, type McpHttpHandler } from '@modelcontextprotocol/server'
import { getRequestListener } from '@hono/node-server'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createSteelbookServer, SERVER_VERSION } from './server.js'
import { catalog } from './catalog.js'

export const MCP_PATH = '/mcp'

let handler: McpHttpHandler | undefined

export function mcpHandler(): McpHttpHandler {
  handler ??= createMcpHandler(() => createSteelbookServer(), { legacy: 'stateless' })
  return handler
}

/** Plain-text landing for humans and health checks. */
export function landing(origin: string): string {
  return [
    `Steelbook MCP v${SERVER_VERSION}`,
    '',
    `Streamable HTTP endpoint: POST ${origin}${MCP_PATH}`,
    `${catalog.counts.components} components · ${catalog.counts.icons} icons · ${catalog.counts.tokens} tokens · catalog from ${catalog.source.repository} @ ${catalog.source.commit.slice(0, 7)}`,
    '',
    'Connect:',
    `  Claude Code   claude mcp add --transport http steelbook ${origin}${MCP_PATH}`,
    `  Cursor / VS Code / Claude Desktop   { "url": "${origin}${MCP_PATH}" }`,
    `  Local (stdio)   npx -y @steelbook/mcp`,
    '',
    `Figma: ${catalog.source.figmaUrl}`,
    `Source: ${catalog.source.repository}`,
  ].join('\n')
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization, mcp-session-id, mcp-protocol-version, last-event-id',
  'access-control-expose-headers': 'mcp-session-id, mcp-protocol-version',
}

/** Web-standard fetch handler: routes `/` and `/mcp`, adds CORS. */
export async function fetchHandler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  const path = url.pathname.replace(/\/+$/, '') || '/'
  if (path === '/' || path === '/index' || path === '/health') {
    return new Response(landing(url.origin), { headers: { 'content-type': 'text/plain; charset=utf-8', ...CORS } })
  }
  if (path === MCP_PATH || path === '/api/mcp') {
    if (request.method === 'GET' && !(request.headers.get('accept') ?? '').includes('text/event-stream')) {
      return new Response(landing(url.origin), { headers: { 'content-type': 'text/plain; charset=utf-8', ...CORS } })
    }
    const res = await mcpHandler().fetch(request)
    const headers = new Headers(res.headers)
    for (const [k, v] of Object.entries(CORS)) headers.set(k, v)
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  }
  return new Response('Not found. The MCP endpoint is /mcp.', { status: 404, headers: { 'content-type': 'text/plain', ...CORS } })
}

/** Node `(req, res)` listener over the same handler — for `http.createServer` and Vercel's Node runtime. */
export const nodeListener: (req: IncomingMessage, res: ServerResponse) => void = getRequestListener(fetchHandler)
