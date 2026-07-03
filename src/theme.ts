import {
  createDarkTheme,
  createLightTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

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

/** Maps a Twitch context theme to the matching Raven's Team-branded Fluent UI theme. */
export const fluentThemeFor = (theme: TwitchTheme): Theme =>
  theme === 'light' ? lightTheme : darkTheme;
