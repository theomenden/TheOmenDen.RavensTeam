import type { ReactNode } from 'react';
import { Field, Select, Switch, makeStyles, tokens } from '@fluentui/react-components';
import {
  DarkThemeRegular,
  SlideTransitionRegular,
  TextDensityRegular,
  TextFontRegular,
  TextFontSizeRegular,
} from '@fluentui/react-icons';
import {
  DENSITY_OPTIONS,
  FONT_OPTIONS,
  TEXT_SIZE_OPTIONS,
  THEME_OPTIONS,
  type Density,
  type FontChoice,
  type PanelSettings,
  type TextSize,
  type ThemeChoice,
} from './model';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  // Icon + text label. inline-flex keeps the glyph on the text baseline row rather than letting it
  // sit proud of it; the icon is 1em, so it scales with the viewer's text-size setting.
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
});

/**
 * A field label with a leading glyph. The icon is purely decorative — Fluent icons are
 * `aria-hidden` unless given a title, so the text alone is the control's accessible name and
 * nothing is announced twice (WCAG 1.1.1).
 */
const IconLabel = ({ icon, children }: { readonly icon: ReactNode; readonly children: string }) => {
  const styles = useStyles();
  return (
    <span className={styles.label}>
      {icon}
      {children}
    </span>
  );
};

/** Props for {@link SettingsControls}. */
export interface SettingsControlsProps {
  /** The settings currently reflected by the controls. */
  readonly value: PanelSettings;
  /** Called with the single field the user changed. */
  readonly onChange: <K extends keyof PanelSettings>(key: K, value: PanelSettings[K]) => void;
}

/**
 * The shared, fully-controlled settings form used by both the viewer drawer and the
 * broadcaster config pages. Every control is a native `<select>` (Fluent `Select`) or an
 * inline `Switch` — nothing portals, so it can't trigger the panel's grey-slab bug. The
 * selects only render valid options, so each `onChange` value is a valid union member.
 */
export const SettingsControls = ({ value, onChange }: SettingsControlsProps) => {
  const styles = useStyles();
  return (
    <div className={styles.form}>
      <Field label={{ children: <IconLabel icon={<DarkThemeRegular />}>Theme</IconLabel> }}>
        <Select
          value={value.theme}
          onChange={(_, data) => onChange('theme', data.value as ThemeChoice)}
        >
          {THEME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={{ children: <IconLabel icon={<TextFontRegular />}>Font</IconLabel> }}>
        <Select
          value={value.font}
          onChange={(_, data) => onChange('font', data.value as FontChoice)}
        >
          {FONT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={{ children: <IconLabel icon={<TextFontSizeRegular />}>Text size</IconLabel> }}>
        <Select
          value={value.textSize}
          onChange={(_, data) => onChange('textSize', data.value as TextSize)}
        >
          {TEXT_SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={{ children: <IconLabel icon={<TextDensityRegular />}>Density</IconLabel> }}>
        <Select
          value={value.density}
          onChange={(_, data) => onChange('density', data.value as Density)}
        >
          {DENSITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Switch
        checked={value.reducedMotion}
        onChange={(_, data) => onChange('reducedMotion', data.checked)}
        label={{
          children: <IconLabel icon={<SlideTransitionRegular />}>Reduce motion</IconLabel>,
        }}
      />
    </div>
  );
};
