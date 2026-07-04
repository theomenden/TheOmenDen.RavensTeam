import { useCallback, useEffect, useState } from 'react';
import { logger } from '../logger';
import { parseSettings, type PanelSettings } from './model';

/** The broadcaster's saved defaults plus a setter that writes them back to Twitch. */
export interface ConfigurationController {
  /** Latest broadcaster segment, parsed to a complete {@link PanelSettings}. */
  readonly broadcasterSettings: PanelSettings;
  /** Persists `settings` to the Configuration Service broadcaster segment. */
  readonly save: (settings: PanelSettings) => void;
}

/** Version stamp for the broadcaster segment (Configuration Service requires one). */
const CONFIG_VERSION = '1';

/**
 * Reads and writes the Twitch Extension **Configuration Service** broadcaster segment.
 *
 * @remarks
 * Mirrors {@link useTwitchAuth}'s guard + `useEffect` pattern. `onChanged` fires on the
 * initial load and after every broadcaster save (including for already-open viewer panels),
 * so the panel stays current without PubSub. `set` does not echo back to the caller, so the
 * config page reflects its own write locally for immediate feedback.
 */
export const useConfiguration = (): ConfigurationController => {
  const [broadcasterSettings, setBroadcasterSettings] = useState<PanelSettings>(() =>
    parseSettings(undefined),
  );

  useEffect(() => {
    if (typeof Twitch === 'undefined' || !Twitch.ext) {
      logger.warn('Twitch Extension Helper not found; configuration unavailable.');
      return;
    }
    const { configuration } = Twitch.ext;
    const read = (): void => setBroadcasterSettings(parseSettings(configuration.broadcaster?.content));
    read(); // pick up a segment that was already cached before mount
    configuration.onChanged(read);
  }, []);

  const save = useCallback((settings: PanelSettings) => {
    if (typeof Twitch === 'undefined' || !Twitch.ext) return;
    Twitch.ext.configuration.set('broadcaster', CONFIG_VERSION, JSON.stringify(settings));
    setBroadcasterSettings(settings);
  }, []);

  return { broadcasterSettings, save };
};
