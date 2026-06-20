import { z } from 'zod';
import { nonEmptyString } from './common.schema.js';

export const generatePrdShape = {
  product_name: nonEmptyString,
  feature_name: nonEmptyString,
  problem_statement: nonEmptyString,
  target_users: nonEmptyString,
  business_goal: nonEmptyString
};

export const GeneratePrdInputSchema = z.object(generatePrdShape);
export type GeneratePrdInput = z.infer<typeof GeneratePrdInputSchema>;
