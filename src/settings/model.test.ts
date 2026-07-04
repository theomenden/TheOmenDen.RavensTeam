import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, parseOverrides, parseSettings, resolveSettings } from './model';

describe('parseOverrides', () => {
  it('keeps only the present, valid fields', () => {
    expect(parseOverrides({ theme: 'dark', font: 'bogus', reducedMotion: true })).toEqual({
      theme: 'dark',
      reducedMotion: true,
    });
  });

  it('accepts a JSON string (the Configuration Service / localStorage shape)', () => {
    expect(parseOverrides('{"density":"compact"}')).toEqual({ density: 'compact' });
  });

  it('returns {} for bad JSON, non-objects, and JSON primitives', () => {
    expect(parseOverrides('not json')).toEqual({});
    expect(parseOverrides('"a bare string"')).toEqual({});
    expect(parseOverrides(null)).toEqual({});
    expect(parseOverrides(42)).toEqual({});
  });
});

describe('parseSettings', () => {
  it('fills every field from defaults when nothing is provided', () => {
    expect(parseSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it('overlays valid fields onto the defaults', () => {
    expect(parseSettings({ theme: 'highContrast' })).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'highContrast',
    });
  });
});

describe('resolveSettings', () => {
  it('lets a present viewer field win over the broadcaster default', () => {
    const broadcaster = { ...DEFAULT_SETTINGS, theme: 'dark' as const };
    expect(resolveSettings(broadcaster, { theme: 'light' }).theme).toBe('light');
  });

  it('falls back to the broadcaster field when the viewer has no override', () => {
    const broadcaster = { ...DEFAULT_SETTINGS, font: 'serif' as const };
    expect(resolveSettings(broadcaster, {}).font).toBe('serif');
  });
});
