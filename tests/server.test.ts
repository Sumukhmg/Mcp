import { createServer } from '../src/server.js';

describe('createServer', () => {
  it('builds a McpServer instance without throwing', () => {
    const mcpServer = createServer();
    expect(mcpServer).toBeDefined();
    expect(mcpServer.server).toBeDefined();
    expect(mcpServer.isConnected()).toBe(false);
  });
});
