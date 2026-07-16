import { useEffect, useState } from 'react';
import { Button, FluentProvider, Text, makeStyles, tokens } from '@fluentui/react-components';
import { CheckmarkCircleFilled, SaveRegular } from '@fluentui/react-icons';
import { useTwitchAuth } from '../twitch/useTwitchAuth';
import { buildTheme } from '../theme';
import { useConfiguration } from '../settings/useConfiguration';
import { PolicyLinks } from '../settings/PolicyLinks';
import { SettingsControls } from '../settings/SettingsControls';
import type { PanelSettings } from '../settings/model';

const useStyles = makeStyles({
  // The config + live-config pages share this. FluentProvider paints the themed background;
  // buildTheme(draft, ...) makes the page a live preview of the chosen theme/font/size.
  page: {
    boxSizing: 'border-box',
    minHeight: '100vh',
    maxWidth: '440px',
    padding: tokens.spacingHorizontalXXL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  // The page's <main>. Holds the column layout so FluentProvider keeps owning only the themed
  // surface and its padding — the visual result is unchanged.
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
  intro: {
    color: tokens.colorNeutralForeground2,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  // Always mounted, even with nothing to report: a live region inserted at the same moment as its
  // text is not reliably announced — it has to already exist for the insertion to register as a
  // change (WCAG 4.1.3). minHeight keeps the row from jumping when the confirmation appears.
  status: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
    minHeight: tokens.lineHeightBase200,
  },
});

/** Which broadcaster surface this is: one-time setup (`config`) vs the live dashboard module (`live`). */
export type ConfigVariant = 'config' | 'live';

/**
 * Per-surface copy. Both write to the same broadcaster segment; only the framing differs.
 *
 * The confirmations carry no "✓" character: the tick is a decorative icon in the markup instead,
 * so screen readers announce "Saved" rather than reading the glyph out as "check mark".
 */
const COPY = {
  config: {
    heading: "Raven's Team — Panel settings",
    intro:
      'These defaults apply to everyone who opens your panel. Viewers can override them for themselves.',
    save: 'Save',
    saved: 'Saved',
  },
  live: {
    heading: "Raven's Team — Live panel controls",
    intro: 'Adjust your panel’s look. Changes apply to your live viewers right away.',
    save: 'Apply',
    saved: 'Applied',
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
      <main className={styles.content}>
        <Text as="h1" size={600} weight="bold">
          {copy.heading}
        </Text>
        <Text className={styles.intro}>{copy.intro}</Text>
        <SettingsControls value={draft} onChange={onChange} />
        <div className={styles.actions}>
          <Button appearance="primary" icon={<SaveRegular />} onClick={onSave}>
            {copy.save}
          </Button>
          <div className={styles.status} role="status">
            {saved && (
              <>
                {/* Decorative — the "Saved" text beside it is what gets announced, so the
                    confirmation never rests on the icon (or on colour) alone. */}
                <CheckmarkCircleFilled />
                <Text size={200}>{copy.saved}</Text>
              </>
            )}
          </div>
        </div>
        <PolicyLinks />
      </main>
    </FluentProvider>
  );
};
