import { z } from 'zod';
import { nonEmptyString, stringList } from './common.schema.js';

export const generateRoadmapShape = {
  product_vision: nonEmptyString,
  features: stringList
};

export const GenerateRoadmapInputSchema = z.object(generateRoadmapShape);
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;
