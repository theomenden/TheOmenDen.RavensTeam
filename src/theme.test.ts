import { describe, expect, it } from 'vitest';
import { buildTheme } from './theme';
import { DEFAULT_SETTINGS } from './settings/model';

const base = DEFAULT_SETTINGS;

describe('buildTheme', () => {
  it('applies a non-default font stack and leaves the default alone', () => {
    const serif = buildTheme({ ...base, font: 'serif' }, 'dark').fontFamilyBase;
    const def = buildTheme({ ...base, font: 'default' }, 'dark').fontFamilyBase;
    expect(serif).toContain('serif');
    expect(def).not.toBe(serif);
  });

  it('scales font-size tokens by the text-size factor (large = 1.15x normal)', () => {
    const normal = Number.parseFloat(buildTheme({ ...base, textSize: 'normal' }, 'dark').fontSizeBase300);
    const large = Number.parseFloat(buildTheme({ ...base, textSize: 'large' }, 'dark').fontSizeBase300);
    expect(large / normal).toBeCloseTo(1.15, 5);
  });

  it('scales spacing tokens by the density factor (compact = 0.72x comfortable)', () => {
    const comfy = Number.parseFloat(buildTheme({ ...base, density: 'comfortable' }, 'dark').spacingHorizontalM);
    const compact = Number.parseFloat(buildTheme({ ...base, density: 'compact' }, 'dark').spacingHorizontalM);
    expect(compact / comfy).toBeCloseTo(0.72, 5);
  });

  it('resolves auto to the Twitch context theme', () => {
    expect(buildTheme({ ...base, theme: 'auto' }, 'light').colorNeutralBackground1).toBe(
      buildTheme({ ...base, theme: 'light' }, 'light').colorNeutralBackground1,
    );
  });

  it('gives high contrast a different surface than dark', () => {
    expect(buildTheme({ ...base, theme: 'highContrast' }, 'dark').colorNeutralBackground1).not.toBe(
      buildTheme({ ...base, theme: 'dark' }, 'dark').colorNeutralBackground1,
    );
  });
});
