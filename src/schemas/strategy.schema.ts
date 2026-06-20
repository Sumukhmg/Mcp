import { z } from 'zod';
import { nonEmptyString } from './common.schema.js';

export const generateStrategyShape = {
  market: nonEmptyString,
  product: nonEmptyString,
  business_goal: nonEmptyString
};

export const GenerateStrategyInputSchema = z.object(generateStrategyShape);
export type GenerateStrategyInput = z.infer<typeof GenerateStrategyInputSchema>;
