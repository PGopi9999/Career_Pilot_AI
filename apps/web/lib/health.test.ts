import { describe, expect, it } from 'vitest';

function isHealthStatus(value: unknown): value is 'ok' | 'degraded' {
  return value === 'ok' || value === 'degraded';
}

describe('health contract', () => {
  it('accepts the only API status values', () => {
    expect(isHealthStatus('ok')).toBe(true);
    expect(isHealthStatus('degraded')).toBe(true);
    expect(isHealthStatus('offline')).toBe(false);
  });
});
