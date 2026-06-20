import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerCompetitorPrompt(mcpServer: McpServer): void {
  mcpServer.registerPrompt(
    'analyze_competitor',
    {
      title: 'Analyze Competitor',
      description: 'Generate feature comparison, SWOT analysis, and recommendations.',
      argsSchema: {
        product_name: z.string().describe('The name of your product'),
        competitors: z.string().describe('Comma-separated list of competitor names')
      }
    },
    ({ product_name, competitors }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              `Use the competitor_analysis tool to compare "${product_name}" against these competitors: ` +
              `${competitors}. Include a feature comparison matrix and SWOT-based recommendations.`
          }
        }
      ]
    })
  );
}
