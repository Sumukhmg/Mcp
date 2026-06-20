import { z } from 'zod';
import { nonEmptyString, stringList } from './common.schema.js';

export const competitorAnalysisShape = {
  product_name: nonEmptyString,
  competitors: stringList
};

export const CompetitorAnalysisInputSchema = z.object(competitorAnalysisShape);
export type CompetitorAnalysisInput = z.infer<typeof CompetitorAnalysisInputSchema>;
