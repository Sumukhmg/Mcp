import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { TEMPLATES, type TemplateName } from './templates.js';
import { FRAMEWORKS } from './frameworks.js';

export function registerResources(mcpServer: McpServer): void {
  for (const name of Object.keys(TEMPLATES) as TemplateName[]) {
    mcpServer.registerResource(
      `template-${name}`,
      `pm-copilot://templates/${name}`,
      {
        title: `${name} template`,
        description: `Reusable ${name} template used by PM-Copilot tools.`,
        mimeType: 'text/markdown'
      },
      async (uri) => ({
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: TEMPLATES[name] }]
      })
    );
  }

  mcpServer.registerResource(
    'framework-library',
    'pm-copilot://frameworks',
    {
      title: 'PM Framework Library',
      description: 'Reference definitions for prioritization, discovery, and strategic analysis frameworks.',
      mimeType: 'application/json'
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(FRAMEWORKS, null, 2) }]
    })
  );
}
