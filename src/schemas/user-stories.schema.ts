import { z } from 'zod';
import { nonEmptyString } from './common.schema.js';

export const generateUserStoriesShape = {
  feature_description: nonEmptyString
};

export const GenerateUserStoriesInputSchema = z.object(generateUserStoriesShape);
export type GenerateUserStoriesInput = z.infer<typeof GenerateUserStoriesInputSchema>;
