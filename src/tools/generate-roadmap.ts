import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { generateRoadmapShape, GenerateRoadmapInputSchema, type GenerateRoadmapInput } from '../schemas/roadmap.schema.js';
import { sampleText } from '../utils/sampling.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are PM-Copilot, an expert Product Manager assistant. You build realistic
quarterly roadmaps that sequence features against a product vision, accounting for dependencies and risk.
Always respond with strict JSON, no markdown fences, no commentary outside the JSON object.`;

function buildPrompt(input: GenerateRoadmapInput): string {
  return `Build a quarterly roadmap for this product vision: "${input.product_vision}".

Features to sequence: ${input.features.join(', ')}.

Return a single JSON object with exactly these keys:
{
  "quarterly_roadmap": [{ "quarter": "Q1"|"Q2"|"Q3"|"Q4", "initiatives": string[] }],
  "milestones": string[],
  "dependencies": string[],
  "risks": string[],
  "success_indicators": string[]
}`;
}

function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function registerGenerateRoadmapTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'generate_roadmap',
    {
      title: 'Generate Roadmap',
      description: 'Generate a quarterly roadmap with milestones, dependencies, risks, and success indicators.',
      inputSchema: generateRoadmapShape
    },
    async (rawArgs) => {
      const input = GenerateRoadmapInputSchema.parse(rawArgs);
      const raw = await sampleText(mcpServer.server, buildPrompt(input), { systemPrompt: SYSTEM_PROMPT, maxTokens: 2500 });
      const parsed = tryParseJson(raw);

      if (parsed === null) {
        logger.warn('generate_roadmap: model did not return valid JSON, returning raw text');
        return { content: [{ type: 'text', text: raw }] };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as Record<string, unknown>
      };
    }
  );
}
