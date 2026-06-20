#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { config } from './config.js';
import { logger } from './utils/logger.js';

async function main(): Promise<void> {
  const mcpServer = createServer();
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  logger.info('pm-copilot-mcp server started', { name: config.serverName, version: config.serverVersion });
}

main().catch((error) => {
  logger.error('Fatal error starting pm-copilot-mcp', { error: error instanceof Error ? error.message : String(error) });
  process.exit(1);
});
