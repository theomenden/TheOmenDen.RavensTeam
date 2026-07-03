import { useEffect, useState } from 'react';

/**
 * Channel logins the viewer has followed via the panel's follow button *this session*.
 *
 * @remarks
 * Twitch's helper only reports follows it prompted ({@link Twitch.ext.actions.onFollow}) — a panel
 * extension has no way to read a viewer's *pre-existing* follows (that needs the viewer's own OAuth
 * token with `user:read:follows`, which the extension's Helix JWT is not). So this reflects
 * in-session follows only; a channel the viewer already followed before opening the panel still
 * shows "Follow" until they act on it here.
 *
 * Register once, high in the tree: `onFollow` is a single global callback, so mounting this per
 * team/list would have later registrations clobber earlier ones. The set update is idempotent, so
 * StrictMode's double-invoke (or a redundant follow) is harmless.
 */
export const useFollowedChannels = (): ReadonlySet<string> => {
  const [followed, setFollowed] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    if (typeof Twitch === 'undefined' || !Twitch.ext?.actions) return;
    Twitch.ext.actions.onFollow((didFollow, channelName) => {
      if (!didFollow) return;
      setFollowed((prev) => {
        if (prev.has(channelName)) return prev;
        const next = new Set(prev);
        next.add(channelName);
        return next;
      });
    });
  }, []);

  return followed;
};
