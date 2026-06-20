import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { logger } from './logger.js';

export interface SampleTextOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Asks the connected MCP client to run an LLM completion (the "sampling" capability).
 * PM-Copilot has no model API key of its own; document generation is delegated to
 * whichever model the host (Claude Desktop, Claude Code, etc.) has configured.
 */
export async function sampleText(
  server: Server,
  userPrompt: string,
  options: SampleTextOptions = {}
): Promise<string> {
  const result = await server.createMessage({
    messages: [
      {
        role: 'user',
        content: { type: 'text', text: userPrompt }
      }
    ],
    systemPrompt: options.systemPrompt,
    maxTokens: options.maxTokens ?? 2000,
    temperature: options.temperature ?? 0.4
  });

  if (result.content.type !== 'text') {
    logger.warn('Sampling returned a non-text content block', { type: result.content.type });
    return '';
  }
  return result.content.text;
}
