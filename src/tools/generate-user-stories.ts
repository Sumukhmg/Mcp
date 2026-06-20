import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  generateUserStoriesShape,
  GenerateUserStoriesInputSchema,
  type GenerateUserStoriesInput
} from '../schemas/user-stories.schema.js';
import { sampleText } from '../utils/sampling.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are PM-Copilot, an expert Product Manager assistant. You write agile user stories
that follow the INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable).
Always respond with strict JSON, no markdown fences, no commentary outside the JSON object.`;

function buildPrompt(input: GenerateUserStoriesInput): string {
  return `Break the following feature down into INVEST-compliant user stories.

Feature description: ${input.feature_description}

Return a single JSON object with exactly these keys:
{
  "epic": string,
  "user_stories": [{ "story": "As a ... I want ... so that ...", "priority": "high"|"medium"|"low" }],
  "acceptance_criteria": string[],
  "edge_cases": string[]
}`;
}

function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function registerGenerateUserStoriesTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'generate_user_stories',
    {
      title: 'Generate User Stories',
      description: 'Generate INVEST-compliant agile user stories with acceptance criteria and edge cases.',
      inputSchema: generateUserStoriesShape
    },
    async (rawArgs) => {
      const input = GenerateUserStoriesInputSchema.parse(rawArgs);
      const raw = await sampleText(mcpServer.server, buildPrompt(input), { systemPrompt: SYSTEM_PROMPT, maxTokens: 2000 });
      const parsed = tryParseJson(raw);

      if (parsed === null) {
        logger.warn('generate_user_stories: model did not return valid JSON, returning raw text');
        return { content: [{ type: 'text', text: raw }] };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as Record<string, unknown>
      };
    }
  );
}
