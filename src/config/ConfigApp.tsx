import { useEffect, useState } from 'react';
import { Button, FluentProvider, Text, makeStyles, tokens } from '@fluentui/react-components';
import { useTwitchAuth } from '../twitch/useTwitchAuth';
import { buildTheme } from '../theme';
import { useConfiguration } from '../settings/useConfiguration';
import { SettingsControls } from '../settings/SettingsControls';
import type { PanelSettings } from '../settings/model';

const useStyles = makeStyles({
  // The config + live-config pages share this. FluentProvider paints the themed background;
  // buildTheme(draft, ...) makes the page a live preview of the chosen theme/font/size.
  page: {
    boxSizing: 'border-box',
    minHeight: '100vh',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
    padding: tokens.spacingHorizontalXXL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  intro: {
    color: tokens.colorNeutralForeground2,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
});

/** Which broadcaster surface this is: one-time setup (`config`) vs the live dashboard module (`live`). */
export type ConfigVariant = 'config' | 'live';

/** Per-surface copy. Both write to the same broadcaster segment; only the framing differs. */
const COPY = {
  config: {
    heading: "Raven's Team — Panel settings",
    intro:
      'These defaults apply to everyone who opens your panel. Viewers can override them for themselves.',
    save: 'Save',
    saved: 'Saved ✓',
  },
  live: {
    heading: "Raven's Team — Live panel controls",
    intro: 'Adjust your panel’s look. Changes apply to your live viewers right away.',
    save: 'Apply',
    saved: 'Applied ✓',
  },
} as const satisfies Record<ConfigVariant, Record<'heading' | 'intro' | 'save' | 'saved', string>>;

/** Props for {@link ConfigApp}. */
export interface ConfigAppProps {
  /** Chooses the surface copy; defaults to the setup (`config`) framing. */
  readonly variant?: ConfigVariant;
}

/**
 * Broadcaster settings page, shared by the Config (setup) and Live-Config (live dashboard)
 * views — `variant` only swaps the framing copy. Edits a local draft seeded from the saved
 * broadcaster segment, previews it live via the page theme, and writes it back to the
 * Configuration Service on save (which `onChanged`-pushes to open viewer panels).
 */
export const ConfigApp = ({ variant = 'config' }: ConfigAppProps) => {
  const styles = useStyles();
  const copy = COPY[variant];
  const { theme } = useTwitchAuth();
  const { broadcasterSettings, save } = useConfiguration();
  const [draft, setDraft] = useState<PanelSettings>(broadcasterSettings);
  const [saved, setSaved] = useState(false);

  // Reseed the draft once the stored segment arrives (onChanged fires after mount).
  useEffect(() => {
    setDraft(broadcasterSettings);
  }, [broadcasterSettings]);

  const onChange = <K extends keyof PanelSettings>(key: K, value: PanelSettings[K]): void => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const onSave = (): void => {
    save(draft);
    setSaved(true);
  };

  return (
    <FluentProvider theme={buildTheme(draft, theme)} className={styles.page}>
      <Text as="h1" size={600} weight="bold">
        {copy.heading}
      </Text>
      <Text className={styles.intro}>{copy.intro}</Text>
      <SettingsControls value={draft} onChange={onChange} />
      <div className={styles.actions}>
        <Button appearance="primary" onClick={onSave}>
          {copy.save}
        </Button>
        {saved && (
          <Text aria-live="polite" size={200}>
            {copy.saved}
          </Text>
        )}
      </div>
    </FluentProvider>
  );
};
