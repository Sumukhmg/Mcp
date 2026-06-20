import { scoreFeatures } from '../src/tools/prioritize-features.js';

describe('scoreFeatures', () => {
  it('ranks higher RICE-scoring features above lower ones in the final prioritization', () => {
    const result = scoreFeatures({
      features: [
        { name: 'High value', reach: 1000, impact: 3, confidence: 90, effort: 1 },
        { name: 'Low value', reach: 50, impact: 1, confidence: 50, effort: 8 }
      ]
    });

    expect(result.final_prioritization).toEqual(['High value', 'Low value']);
    expect(result.rice_scores).toHaveLength(2);
    expect(result.rice_scores[0].rice_score).toBeGreaterThan(result.rice_scores[1].rice_score);
  });

  it('respects an explicit moscow hint regardless of score', () => {
    const result = scoreFeatures({
      features: [{ name: 'Compliance requirement', effort: 100, moscow_hint: 'must' }]
    });
    expect(result.moscow_categories[0]).toEqual({ name: 'Compliance requirement', category: 'Must' });
  });
});
