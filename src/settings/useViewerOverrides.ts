import { useCallback, useState } from 'react';
import { logger } from '../logger';
import { parseOverrides, type PanelSettings } from './model';

/** `localStorage` key for this viewer's per-panel setting overrides. */
const STORAGE_KEY = 'ravens-team:viewer-settings';

/** Reads and validates the stored overrides; any failure yields an empty override set. */
const load = (): Partial<PanelSettings> => {
  try {
    return parseOverrides(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    logger.warn('Failed to read viewer settings from localStorage', error);
    return {};
  }
};

/** Persists the overrides, swallowing storage errors (e.g. storage disabled). */
const persist = (overrides: Partial<PanelSettings>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch (error) {
    logger.warn('Failed to persist viewer settings to localStorage', error);
  }
};

/** This viewer's local overrides plus setters. */
export interface ViewerOverridesController {
  readonly overrides: Partial<PanelSettings>;
  /** Sets one field for this viewer and persists the change. */
  readonly setOverride: <K extends keyof PanelSettings>(key: K, value: PanelSettings[K]) => void;
  /** Clears every override, reverting to the broadcaster's defaults. */
  readonly reset: () => void;
}

/** Client-only, per-viewer setting overrides backed by `localStorage`. */
export const useViewerOverrides = (): ViewerOverridesController => {
  const [overrides, setOverrides] = useState<Partial<PanelSettings>>(load);

  const setOverride = useCallback(
    <K extends keyof PanelSettings>(key: K, value: PanelSettings[K]) => {
      setOverrides((prev) => {
        const next = { ...prev, [key]: value };
        persist(next);
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setOverrides({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore — nothing to clear if storage is unavailable
    }
  }, []);

  return { overrides, setOverride, reset };
};
