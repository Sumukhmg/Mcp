import { z } from 'zod';
import { nonEmptyString } from './common.schema.js';

const FeatureObjectSchema = z.object({
  name: nonEmptyString,
  reach: z.number().positive().optional(),
  impact: z.number().min(0).max(3).optional(),
  confidence: z.number().min(0).max(100).optional(),
  effort: z.number().positive().optional(),
  ease: z.number().min(1).max(10).optional(),
  moscow_hint: z.enum(['must', 'should', 'could', 'wont']).optional()
});

const FeatureInputSchema = z.union([nonEmptyString, FeatureObjectSchema]);

export const prioritizeFeaturesShape = {
  features: z.array(FeatureInputSchema).min(1, 'provide at least one feature')
};

export const PrioritizeFeaturesInputSchema = z.object(prioritizeFeaturesShape);
export type PrioritizeFeaturesInput = z.infer<typeof PrioritizeFeaturesInputSchema>;
export type FeatureInput = z.infer<typeof FeatureInputSchema>;

export interface NormalizedFeature {
  name: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  ease: number;
  moscow_hint?: 'must' | 'should' | 'could' | 'wont';
}

const DEFAULTS = {
  reach: 100,
  impact: 2,
  confidence: 80,
  effort: 1,
  ease: 5
};

export function normalizeFeature(feature: FeatureInput): NormalizedFeature {
  if (typeof feature === 'string') {
    return { name: feature, ...DEFAULTS };
  }
  return {
    name: feature.name,
    reach: feature.reach ?? DEFAULTS.reach,
    impact: feature.impact ?? DEFAULTS.impact,
    confidence: feature.confidence ?? DEFAULTS.confidence,
    effort: feature.effort ?? DEFAULTS.effort,
    ease: feature.ease ?? DEFAULTS.ease,
    moscow_hint: feature.moscow_hint
  };
}
