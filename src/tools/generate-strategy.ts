import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { generateStrategyShape, GenerateStrategyInputSchema, type GenerateStrategyInput } from '../schemas/strategy.schema.js';
import { sampleText } from '../utils/sampling.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are PM-Copilot, an expert Product Manager assistant. You build product
strategy documents that connect market context to a clear vision, mission, and growth plan.
Always respond with strict JSON, no markdown fences, no commentary outside the JSON object.`;

function buildPrompt(input: GenerateStrategyInput): string {
  return `Build a product strategy document.

Market: ${input.market}
Product: ${input.product}
Business goal: ${input.business_goal}

Return a single JSON object with exactly these keys:
{
  "vision": string,
  "mission": string,
  "strategic_goals": string[],
  "market_analysis": string,
  "positioning": string,
  "growth_plan": string[]
}`;
}

function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function registerGenerateStrategyTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'generate_strategy',
    {
      title: 'Generate Strategy',
      description: 'Build a product strategy document: vision, mission, goals, market analysis, positioning, growth plan.',
      inputSchema: generateStrategyShape
    },
    async (rawArgs) => {
      const input = GenerateStrategyInputSchema.parse(rawArgs);
      const raw = await sampleText(mcpServer.server, buildPrompt(input), { systemPrompt: SYSTEM_PROMPT, maxTokens: 2000 });
      const parsed = tryParseJson(raw);

      if (parsed === null) {
        logger.warn('generate_strategy: model did not return valid JSON, returning raw text');
        return { content: [{ type: 'text', text: raw }] };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as Record<string, unknown>
      };
    }
  );
}
