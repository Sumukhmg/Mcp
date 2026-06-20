export const FRAMEWORKS = {
  prioritization: {
    RICE: 'Score = (Reach x Impact x Confidence) / Effort. Ranks features by expected impact per unit of effort.',
    ICE: 'Score = (Impact x Confidence x Ease) / 3. A lightweight alternative to RICE for fast triage.',
    MoSCoW: 'Buckets features into Must have, Should have, Could have, and Won\'t have for a given release.',
    Kano: 'Classifies features as Basic, Performance, or Delighter based on customer satisfaction impact.'
  },
  discovery: {
    JTBD: 'Jobs To Be Done: frames features around the functional, emotional, and social job a customer is "hiring" the product to do.',
    OpportunitySolutionTree: 'Maps a desired outcome to opportunities (customer needs/pain points) to candidate solutions to experiments.'
  },
  strategicAnalysis: {
    SWOT: 'Strengths, Weaknesses, Opportunities, Threats — internal and external factors affecting competitiveness.',
    PortersFiveForces: 'Competitive rivalry, supplier power, buyer power, threat of substitution, threat of new entry.',
    PESTLE: 'Political, Economic, Social, Technological, Legal, Environmental factors shaping the market.'
  }
} as const;

export type FrameworkCategory = keyof typeof FRAMEWORKS;
