import { z } from 'zod';
import { nonEmptyString } from './common.schema.js';

export const generateKpisShape = {
  product_type: nonEmptyString,
  goal: nonEmptyString
};

export const GenerateKpisInputSchema = z.object(generateKpisShape);
export type GenerateKpisInput = z.infer<typeof GenerateKpisInputSchema>;
