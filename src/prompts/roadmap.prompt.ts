import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerRoadmapPrompt(mcpServer: McpServer): void {
  mcpServer.registerPrompt(
    'create_quarterly_roadmap',
    {
      title: 'Create Quarterly Roadmap',
      description: 'Generate a roadmap with milestones, dependencies, and KPIs.',
      argsSchema: {
        product_vision: z.string().describe('The long-term product vision'),
        features: z.string().describe('Comma-separated list of candidate features')
      }
    },
    ({ product_vision, features }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              `Use the generate_roadmap tool to build a quarterly roadmap for the vision: "${product_vision}". ` +
              `Candidate features: ${features}. Sequence them by value and dependency.`
          }
        }
      ]
    })
  );
}
