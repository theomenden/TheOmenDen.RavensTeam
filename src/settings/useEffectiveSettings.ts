import { useMemo } from 'react';
import { resolveSettings, type PanelSettings } from './model';
import { useConfiguration } from './useConfiguration';
import { useViewerOverrides } from './useViewerOverrides';

/** Effective settings for the panel, plus the viewer's override controls. */
export interface EffectiveSettings {
  /** Broadcaster defaults with this viewer's overrides applied on top. */
  readonly settings: PanelSettings;
  /** The broadcaster's saved defaults, unmodified (for the "reset to defaults" affordance). */
  readonly broadcasterSettings: PanelSettings;
  /** Sets one field for this viewer. */
  readonly setOverride: <K extends keyof PanelSettings>(key: K, value: PanelSettings[K]) => void;
  /** Clears every viewer override. */
  readonly reset: () => void;
}

/**
 * The panel's single settings entry point: composes the broadcaster defaults
 * ({@link useConfiguration}) with this viewer's overrides ({@link useViewerOverrides})
 * into one effective {@link PanelSettings}.
 */
export const useEffectiveSettings = (): EffectiveSettings => {
  const { broadcasterSettings } = useConfiguration();
  const { overrides, setOverride, reset } = useViewerOverrides();
  const settings = useMemo(
    () => resolveSettings(broadcasterSettings, overrides),
    [broadcasterSettings, overrides],
  );
  return { settings, broadcasterSettings, setOverride, reset };
};
