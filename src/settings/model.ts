/**
 * Shared settings model for the Raven's Team panel: the {@link PanelSettings} shape, its
 * option tables, and the pure parse/merge helpers that guard every trust boundary — the
 * Twitch Configuration Service JSON string and the viewer's `localStorage` blob.
 *
 * @packageDocumentation
 */

/** Theme choice; `'auto'` follows the Twitch `onContext` light/dark signal. */
export type ThemeChoice = 'auto' | 'light' | 'dark' | 'highContrast';

/** Font preset; each maps to a CSP-safe system font stack (no web fonts). */
export type FontChoice = 'default' | 'serif' | 'mono' | 'rounded';

/** Text-size preset; scales the Fluent `fontSizeBase`/`lineHeightBase` tokens. */
export type TextSize = 'small' | 'normal' | 'large';

/** Roster density; scales the Fluent spacing tokens. */
export type Density = 'comfortable' | 'compact';

/** The full set of panel preferences a broadcaster or viewer can choose. */
export interface PanelSettings {
  readonly theme: ThemeChoice;
  readonly font: FontChoice;
  readonly textSize: TextSize;
  readonly density: Density;
  readonly reducedMotion: boolean;
}

/** Built-in fallback, used when neither the broadcaster nor the viewer has chosen. */
export const DEFAULT_SETTINGS: PanelSettings = {
  theme: 'auto',
  font: 'default',
  textSize: 'normal',
  density: 'comfortable',
  reducedMotion: false,
};

/** A labelled option for a native `<select>`. */
export interface Option<T extends string> {
  readonly value: T;
  readonly label: string;
}

/** Theme choices, in the order shown in the picker. */
export const THEME_OPTIONS = [
  { value: 'auto', label: 'Match Twitch' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'highContrast', label: 'High contrast' },
] as const satisfies readonly Option<ThemeChoice>[];

/** Font choices, in the order shown in the picker. */
export const FONT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Monospace' },
  { value: 'rounded', label: 'Rounded' },
] as const satisfies readonly Option<FontChoice>[];

/** Text-size choices, in the order shown in the picker. */
export const TEXT_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
] as const satisfies readonly Option<TextSize>[];

/** Density choices, in the order shown in the picker. */
export const DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
] as const satisfies readonly Option<Density>[];

// --- Parsing / merging (pure — the settings trust boundary) ---

const isOneOf = <T extends string>(options: readonly Option<T>[], value: unknown): value is T =>
  typeof value === 'string' && options.some((option) => option.value === value);

/** Coerces a raw value (JSON string or object) to a plain record, or `null` if it is neither. */
const toRecord = (raw: unknown): Record<string, unknown> | null => {
  let value = raw;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
};

/**
 * Narrows arbitrary input to the subset of {@link PanelSettings} fields that are present
 * and valid. Unknown or malformed fields are dropped rather than trusted — this is the
 * single boundary that turns untrusted config/storage data into typed settings.
 */
export const parseOverrides = (raw: unknown): Partial<PanelSettings> => {
  const record = toRecord(raw);
  if (!record) return {};
  const out: { -readonly [K in keyof PanelSettings]?: PanelSettings[K] } = {};
  if (isOneOf(THEME_OPTIONS, record.theme)) out.theme = record.theme;
  if (isOneOf(FONT_OPTIONS, record.font)) out.font = record.font;
  if (isOneOf(TEXT_SIZE_OPTIONS, record.textSize)) out.textSize = record.textSize;
  if (isOneOf(DENSITY_OPTIONS, record.density)) out.density = record.density;
  if (typeof record.reducedMotion === 'boolean') out.reducedMotion = record.reducedMotion;
  return out;
};

/** Parses input into a complete {@link PanelSettings}, filling gaps with {@link DEFAULT_SETTINGS}. */
export const parseSettings = (raw: unknown): PanelSettings => ({
  ...DEFAULT_SETTINGS,
  ...parseOverrides(raw),
});

/** Merges viewer overrides over broadcaster defaults — a present viewer field always wins. */
export const resolveSettings = (
  defaults: PanelSettings,
  overrides: Partial<PanelSettings>,
): PanelSettings => ({ ...defaults, ...overrides });
