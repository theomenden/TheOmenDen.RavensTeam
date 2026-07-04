import { Field, Select, Switch, makeStyles, tokens } from '@fluentui/react-components';
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
});

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
      <Field label="Theme">
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

      <Field label="Font">
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

      <Field label="Text size">
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

      <Field label="Density">
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
        label="Reduce motion"
      />
    </div>
  );
};
