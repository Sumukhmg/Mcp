import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerStrategyPrompt(mcpServer: McpServer): void {
  mcpServer.registerPrompt(
    'build_product_strategy',
    {
      title: 'Build Product Strategy',
      description: 'Generate a strategic plan aligned with business goals.',
      argsSchema: {
        market: z.string().describe('The target market or industry'),
        product: z.string().describe('The product name and short description'),
        business_goal: z.string().describe('The business goal the strategy should serve')
      }
    },
    ({ market, product, business_goal }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              `Use the generate_strategy tool to build a product strategy for "${product}" in the ` +
              `"${market}" market, aligned with this business goal: "${business_goal}".`
          }
        }
      ]
    })
  );
}
