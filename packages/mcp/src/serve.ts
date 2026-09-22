/** Local HTTP server: `pnpm --filter @steelbook/mcp serve` → http://localhost:3333/mcp */
import { createServer } from 'node:http'
import { nodeListener, MCP_PATH } from './http.js'

const port = Number(process.env.PORT ?? 3333)
createServer(nodeListener).listen(port, () => {
  console.log(`Steelbook MCP listening on http://localhost:${port}${MCP_PATH}`)
})
