import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  prioritizeFeaturesShape,
  PrioritizeFeaturesInputSchema,
  normalizeFeature,
  type NormalizedFeature
} from '../schemas/prioritization.schema.js';

interface ScoredFeature extends NormalizedFeature {
  rice_score: number;
  ice_score: number;
  moscow: 'Must' | 'Should' | 'Could' | "Won't";
}

function riceScore(f: NormalizedFeature): number {
  return Math.round(((f.reach * f.impact * (f.confidence / 100)) / f.effort) * 100) / 100;
}

function iceScore(f: NormalizedFeature): number {
  return Math.round(((f.impact * (10 / 3) * (f.confidence / 100) * 10 * f.ease) / 3) * 100) / 100;
}

function moscowFor(f: NormalizedFeature, rice: number, sorted: number[]): ScoredFeature['moscow'] {
  if (f.moscow_hint) {
    const hintMap: Record<NonNullable<NormalizedFeature['moscow_hint']>, ScoredFeature['moscow']> = {
      must: 'Must',
      should: 'Should',
      could: 'Could',
      wont: "Won't"
    };
    return hintMap[f.moscow_hint];
  }
  const rank = sorted.indexOf(rice);
  const quartile = rank / Math.max(sorted.length - 1, 1);
  if (quartile <= 0.25) return 'Must';
  if (quartile <= 0.5) return 'Should';
  if (quartile <= 0.75) return 'Could';
  return "Won't";
}

export function scoreFeatures(input: { features: Parameters<typeof normalizeFeature>[0][] }) {
  const normalized = input.features.map(normalizeFeature);
  const riceSorted = normalized.map(riceScore).sort((a, b) => b - a);

  const scored: ScoredFeature[] = normalized.map((f) => {
    const rice = riceScore(f);
    return {
      ...f,
      rice_score: rice,
      ice_score: iceScore(f),
      moscow: moscowFor(f, rice, riceSorted)
    };
  });

  const finalPrioritization = [...scored].sort((a, b) => b.rice_score - a.rice_score).map((f) => f.name);

  return {
    rice_scores: scored.map(({ name, reach, impact, confidence, effort, rice_score }) => ({
      name,
      reach,
      impact,
      confidence,
      effort,
      rice_score
    })),
    ice_scores: scored.map(({ name, impact, confidence, ease, ice_score }) => ({
      name,
      impact,
      confidence,
      ease,
      ice_score
    })),
    moscow_categories: scored.map(({ name, moscow }) => ({ name, category: moscow })),
    final_prioritization: finalPrioritization
  };
}

export function registerPrioritizeFeaturesTool(mcpServer: McpServer): void {
  mcpServer.registerTool(
    'prioritize_features',
    {
      title: 'Prioritize Features',
      description:
        'Rank features using RICE, ICE, and MoSCoW frameworks. Accepts plain feature names or objects ' +
        'with reach/impact/confidence/effort/ease to refine the scoring; missing fields use sensible defaults.',
      inputSchema: prioritizeFeaturesShape
    },
    async (rawArgs) => {
      const input = PrioritizeFeaturesInputSchema.parse(rawArgs);
      const structured = scoreFeatures(input);

      return {
        content: [{ type: 'text', text: JSON.stringify(structured, null, 2) }],
        structuredContent: structured
      };
    }
  );
}
