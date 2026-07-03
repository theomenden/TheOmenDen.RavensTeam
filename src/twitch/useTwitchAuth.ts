import { useEffect, useState } from 'react';
import { logger } from '../logger';
import type { TwitchTheme } from '../theme';
import type { TwitchAuth } from './types';

/** Reactive Twitch auth + theme sourced from the Extension Helper. */
export interface TwitchSession {
  /** Current auth, or `null` until `onAuthorized` first fires. */
  readonly auth: TwitchAuth | null;
  /** Panel theme; Twitch defaults to dark until a context update says otherwise. */
  readonly theme: TwitchTheme;
}

/**
 * Subscribes to the Twitch Extension Helper (`Twitch.ext`). Exposes the current
 * {@link TwitchAuth} and panel theme reactively.
 *
 * @remarks
 * `helixToken` refreshes periodically; `onAuthorized` fires again each time, so `auth` is
 * replaced with a fresh token and Helix calls stay authenticated. When the helper is absent
 * (e.g. running outside a Twitch iframe) this hook stays in its initial state.
 */
export const useTwitchAuth = (): TwitchSession => {
  const [auth, setAuth] = useState<TwitchAuth | null>(null);
  const [theme, setTheme] = useState<TwitchTheme>('dark');

  useEffect(() => {
    if (typeof Twitch === 'undefined' || !Twitch.ext) {
      logger.warn('Twitch Extension Helper not found; running outside Twitch?');
      return;
    }
    const ext = Twitch.ext;
    ext.onAuthorized((authorized) => {
      setAuth({
        channelId: authorized.channelId,
        clientId: authorized.clientId,
        helixToken: authorized.helixToken,
      });
    });
    ext.onContext((context) => {
      if (context.theme === 'light' || context.theme === 'dark') {
        setTheme(context.theme);
      }
    });
  }, []);

  return { auth, theme };
};
