import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  competitorAnalysisShape,
  CompetitorAnalysisInputSchema,
  type CompetitorAnalysisInput
} from '../schemas/competitor.schema.js';
import { sampleText } from '../utils/sampling.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are PM-Copilot, an expert Product Manager assistant specializing in competitive
analysis. Use SWOT thinking to evaluate competitors. Always respond with strict JSON, no markdown fences,
no commentary outside the JSON object.`;

function buildPrompt(input: CompetitorAnalysisInput): string {
  return `Analyze "${input.product_name}" against these competitors: ${input.competitors.join(', ')}.

Return a single JSON object with exactly these keys:
{
  "feature_comparison_matrix": [{ "feature": string, "${input.product_name}": string, ...competitorColumns }],
  "strengths": string[],
  "weaknesses": string[],
  "opportunities": string[],
  "threats": string[],
  "strategic_recommendations": string[]
}`;
}

function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function registerCompetitorAnalysisTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'competitor_analysis',
    {
      title: 'Competitor Analysis',
      description: 'Analyze competitors and identify strategic opportunities using a SWOT-style breakdown.',
      inputSchema: competitorAnalysisShape
    },
    async (rawArgs) => {
      const input = CompetitorAnalysisInputSchema.parse(rawArgs);
      const raw = await sampleText(mcpServer.server, buildPrompt(input), { systemPrompt: SYSTEM_PROMPT, maxTokens: 2500 });
      const parsed = tryParseJson(raw);

      if (parsed === null) {
        logger.warn('competitor_analysis: model did not return valid JSON, returning raw text');
        return { content: [{ type: 'text', text: raw }] };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as Record<string, unknown>
      };
    }
  );
}
