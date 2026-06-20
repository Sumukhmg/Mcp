import { z } from 'zod';

export const nonEmptyString = z.string().trim().min(1, 'must not be empty');

export const stringList = z.array(nonEmptyString).min(1, 'provide at least one item');
