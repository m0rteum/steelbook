#!/usr/bin/env node
/**
 * `npx @steelbook/mcp` — the local transport. One server per process over
 * stdin/stdout, which is what Claude Code, Claude Desktop, Cursor and VS Code
 * speak when given a command.
 */
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import { createSteelbookServer } from './server.js'

serveStdio(() => createSteelbookServer())
