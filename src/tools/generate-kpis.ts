import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { generateKpisShape, GenerateKpisInputSchema, type GenerateKpisInput } from '../schemas/kpi.schema.js';
import { sampleText } from '../utils/sampling.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are PM-Copilot, an expert Product Manager assistant. You design KPI frameworks
anchored on a single North Star Metric with supporting leading and lagging indicators.
Always respond with strict JSON, no markdown fences, no commentary outside the JSON object.`;

function buildPrompt(input: GenerateKpisInput): string {
  return `Design a KPI framework for a ${input.product_type} product whose goal is: "${input.goal}".

Return a single JSON object with exactly these keys:
{
  "north_star_metric": string,
  "leading_indicators": string[],
  "lagging_indicators": string[],
  "dashboard_suggestions": string[]
}`;
}

function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function registerGenerateKpisTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'generate_kpis',
    {
      title: 'Generate KPIs',
      description: 'Generate a KPI framework with a North Star Metric, leading/lagging indicators, and dashboards.',
      inputSchema: generateKpisShape
    },
    async (rawArgs) => {
      const input = GenerateKpisInputSchema.parse(rawArgs);
      const raw = await sampleText(mcpServer.server, buildPrompt(input), { systemPrompt: SYSTEM_PROMPT, maxTokens: 1500 });
      const parsed = tryParseJson(raw);

      if (parsed === null) {
        logger.warn('generate_kpis: model did not return valid JSON, returning raw text');
        return { content: [{ type: 'text', text: raw }] };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as Record<string, unknown>
      };
    }
  );
}
