import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerPrdPrompt(mcpServer: McpServer): void {
  mcpServer.registerPrompt(
    'create_prd',
    {
      title: 'Create PRD',
      description: 'Generate a complete PRD from a feature idea and business objective.',
      argsSchema: {
        feature_idea: z.string().describe('A short description of the feature idea'),
        business_objective: z.string().describe('The business objective this feature should serve')
      }
    },
    ({ feature_idea, business_objective }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              `Use the generate_prd tool to write a complete PRD for this feature idea: "${feature_idea}". ` +
              `It should serve the following business objective: "${business_objective}". ` +
              'Ask me for any missing fields (product name, target users, problem statement) before calling the tool.'
          }
        }
      ]
    })
  );
}
