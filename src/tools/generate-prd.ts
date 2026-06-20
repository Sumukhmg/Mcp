import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { generatePrdShape, GeneratePrdInputSchema, type GeneratePrdInput } from '../schemas/prd.schema.js';
import { sampleText } from '../utils/sampling.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are PM-Copilot, an expert Product Manager assistant. You write enterprise-grade
Product Requirement Documents (PRDs). Always respond with strict JSON matching the requested schema,
with no markdown fences and no commentary outside the JSON object.`;

function buildPrompt(input: GeneratePrdInput): string {
  return `Write a PRD for the following feature.

Product: ${input.product_name}
Feature: ${input.feature_name}
Problem statement: ${input.problem_statement}
Target users: ${input.target_users}
Business goal: ${input.business_goal}

Return a single JSON object with exactly these keys:
{
  "executive_summary": string,
  "problem_statement": string,
  "goals": string[],
  "non_goals": string[],
  "user_personas": string[],
  "functional_requirements": string[],
  "non_functional_requirements": string[],
  "success_metrics": string[],
  "risks": string[],
  "open_questions": string[]
}`;
}

function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function registerGeneratePrdTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'generate_prd',
    {
      title: 'Generate PRD',
      description: 'Create an enterprise-grade Product Requirement Document from a feature idea.',
      inputSchema: generatePrdShape
    },
    async (rawArgs) => {
      const input = GeneratePrdInputSchema.parse(rawArgs);
      const raw = await sampleText(mcpServer.server, buildPrompt(input), { systemPrompt: SYSTEM_PROMPT, maxTokens: 3000 });
      const parsed = tryParseJson(raw);

      if (parsed === null) {
        logger.warn('generate_prd: model did not return valid JSON, returning raw text');
        return {
          content: [{ type: 'text', text: raw }]
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as Record<string, unknown>
      };
    }
  );
}
