import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerUserStoriesPrompt(mcpServer: McpServer): void {
  mcpServer.registerPrompt(
    'generate_user_stories_prompt',
    {
      title: 'Generate User Stories',
      description: 'Create INVEST-compliant user stories with acceptance criteria.',
      argsSchema: {
        feature_description: z.string().describe('A description of the feature to break down into stories')
      }
    },
    ({ feature_description }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Use the generate_user_stories tool to break down this feature into INVEST-compliant user stories with acceptance criteria and edge cases: "${feature_description}".`
          }
        }
      ]
    })
  );
}
