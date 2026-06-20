import { normalizeFeature, type FeatureInput } from '../src/schemas/prioritization.schema.js';

describe('normalizeFeature', () => {
  it('applies defaults for plain string features', () => {
    const result = normalizeFeature('Dark mode');
    expect(result).toEqual({
      name: 'Dark mode',
      reach: 100,
      impact: 2,
      confidence: 80,
      effort: 1,
      ease: 5
    });
  });

  it('preserves provided numeric fields and falls back for missing ones', () => {
    const feature: FeatureInput = { name: 'SSO', reach: 500, effort: 4 };
    const result = normalizeFeature(feature);
    expect(result.name).toBe('SSO');
    expect(result.reach).toBe(500);
    expect(result.effort).toBe(4);
    expect(result.impact).toBe(2);
    expect(result.confidence).toBe(80);
    expect(result.ease).toBe(5);
  });

  it('carries through an explicit moscow hint', () => {
    const result = normalizeFeature({ name: 'Audit logs', moscow_hint: 'should' });
    expect(result.moscow_hint).toBe('should');
  });
});
