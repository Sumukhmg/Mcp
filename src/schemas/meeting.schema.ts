import { z } from 'zod';
import { nonEmptyString } from './common.schema.js';

export const analyzeMeetingNotesShape = {
  meeting_notes: nonEmptyString
};

export const AnalyzeMeetingNotesInputSchema = z.object(analyzeMeetingNotesShape);
export type AnalyzeMeetingNotesInput = z.infer<typeof AnalyzeMeetingNotesInputSchema>;
