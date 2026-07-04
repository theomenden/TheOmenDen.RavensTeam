import {
  createDarkTheme,
  createHighContrastTheme,
  createLightTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';
import type { Density, FontChoice, PanelSettings, TextSize } from './settings/model';

/** Panel theme signal, as reported by the Twitch Extension Helper `onContext` callback. */
export type TwitchTheme = 'light' | 'dark';

/** Raven's Team brand ramp (generated with the Fluent UI theme designer). */
const ravensTeam: BrandVariants = {
  10: '#040208',
  20: '#1D1030',
  30: '#321557',
  40: '#441776',
  50: '#591695',
  60: '#6F11B2',
  70: '#8707CE',
  80: '#9E0AE3',
  90: '#B129EA',
  100: '#C142ED',
  110: '#CF59F0',
  120: '#DB6FF1',
  130: '#E685F2',
  140: '#EF9BF4',
  150: '#F6B0F6',
  160: '#FBC6F8',
};

const lightTheme: Theme = createLightTheme(ravensTeam);

const darkTheme: Theme = {
  ...createDarkTheme(ravensTeam),
  // Lift the brand-on-dark foregrounds one ramp step so brand text/icons stay legible
  // on dark surfaces (matches the theme designer's dark override).
  colorBrandForeground1: ravensTeam[110],
  colorBrandForeground2: ravensTeam[120],
  // WCAG 1.4.3 (AA): Fluent's default dark brand-link steps (100/110/90) only reach
  // ~3.7–4.4:1 on the dark panel/card backgrounds. Bump every link state to ramp[120]+
  // (≥4.55:1 on both) so member/team links stay readable without losing the purple.
  colorBrandForegroundLink: ravensTeam[120],
  colorBrandForegroundLinkHover: ravensTeam[130],
  colorBrandForegroundLinkPressed: ravensTeam[140],
  colorBrandForegroundLinkSelected: ravensTeam[120],
};

/** Maximum-contrast theme for the a11y "High contrast" choice (Fluent's fixed HC palette). */
const highContrastTheme: Theme = createHighContrastTheme();

/** CSP-safe system font stacks for each non-default {@link FontChoice} (no web fonts). */
const FONT_STACKS: Record<Exclude<FontChoice, 'default'>, string> = {
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono: 'ui-monospace, "Cascadia Code", "Segoe UI Mono", Consolas, monospace',
  rounded: 'ui-rounded, "SF Pro Rounded", "Segoe UI", system-ui, sans-serif',
};

/** Multiplier applied to font-size/line-height tokens per {@link TextSize}. */
const TEXT_SCALE: Record<TextSize, number> = { small: 0.9, normal: 1, large: 1.15 };

/** Multiplier applied to spacing tokens per {@link Density}. */
const DENSITY_SCALE: Record<Density, number> = { comfortable: 1, compact: 0.72 };

/** Picks the base Fluent theme for a {@link PanelSettings.theme} choice. */
const baseThemeFor = (choice: PanelSettings['theme'], context: TwitchTheme): Theme => {
  switch (choice) {
    case 'light':
      return lightTheme;
    case 'dark':
      return darkTheme;
    case 'highContrast':
      return highContrastTheme;
    case 'auto':
      return context === 'light' ? lightTheme : darkTheme;
  }
};

/**
 * Multiplies every `px`-valued token whose key starts with one of `prefixes` by `factor`.
 * Reads the live theme object, so it needs no hardcoded token-name list.
 */
// ponytail: one generic scaler covers both text-size and density — no per-component edits
const scaleTokens = (theme: Theme, factor: number, prefixes: readonly string[]): Theme => {
  if (factor === 1) return theme;
  const scaled: Record<string, unknown> = { ...theme };
  for (const [key, value] of Object.entries(theme)) {
    if (typeof value === 'string' && value.endsWith('px') && prefixes.some((p) => key.startsWith(p))) {
      const px = Number.parseFloat(value);
      if (!Number.isNaN(px)) scaled[key] = `${px * factor}px`;
    }
  }
  return scaled as Theme;
};

/**
 * Builds the Fluent theme for the effective {@link PanelSettings}: base theme (light/dark/
 * high-contrast/auto) then font, text-size, and density overrides layered on top.
 */
export const buildTheme = (settings: PanelSettings, context: TwitchTheme): Theme => {
  const base = baseThemeFor(settings.theme, context);
  const withFont: Theme =
    settings.font === 'default' ? base : { ...base, fontFamilyBase: FONT_STACKS[settings.font] };
  const withText = scaleTokens(withFont, TEXT_SCALE[settings.textSize], [
    'fontSizeBase',
    'lineHeightBase',
  ]);
  return scaleTokens(withText, DENSITY_SCALE[settings.density], [
    'spacingVertical',
    'spacingHorizontal',
  ]);
};
