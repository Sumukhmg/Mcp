import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyzeMeetingNotesShape,
  AnalyzeMeetingNotesInputSchema,
  type AnalyzeMeetingNotesInput
} from '../schemas/meeting.schema.js';
import { sampleText } from '../utils/sampling.js';
import { logger } from '../utils/logger.js';

const SYSTEM_PROMPT = `You are PM-Copilot, an expert Product Manager assistant. You extract actionable
information from raw meeting notes. Always respond with strict JSON, no markdown fences, no commentary
outside the JSON object.`;

function buildPrompt(input: AnalyzeMeetingNotesInput): string {
  return `Extract structured information from these meeting notes:

"""
${input.meeting_notes}
"""

Return a single JSON object with exactly these keys:
{
  "summary": string,
  "decisions": string[],
  "risks": string[],
  "action_items": [{ "owner": string, "task": string, "due": string }],
  "follow_ups": string[]
}`;
}

function tryParseJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function registerAnalyzeMeetingNotesTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'analyze_meeting_notes',
    {
      title: 'Analyze Meeting Notes',
      description: 'Extract a summary, decisions, risks, action items, and follow-ups from meeting notes.',
      inputSchema: analyzeMeetingNotesShape
    },
    async (rawArgs) => {
      const input = AnalyzeMeetingNotesInputSchema.parse(rawArgs);
      const raw = await sampleText(mcpServer.server, buildPrompt(input), { systemPrompt: SYSTEM_PROMPT, maxTokens: 2000 });
      const parsed = tryParseJson(raw);

      if (parsed === null) {
        logger.warn('analyze_meeting_notes: model did not return valid JSON, returning raw text');
        return { content: [{ type: 'text', text: raw }] };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(parsed, null, 2) }],
        structuredContent: parsed as Record<string, unknown>
      };
    }
  );
}
