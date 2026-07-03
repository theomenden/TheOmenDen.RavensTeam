import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFollowedChannels } from './useFollowedChannels';

type FollowCallback = (didFollow: boolean, channelName: string) => void;

/** Stub the helper and hand back the captured onFollow callback so tests can drive it. */
const stubHelper = () => {
  let callback: FollowCallback = () => {};
  (globalThis as { Twitch?: unknown }).Twitch = {
    ext: {
      actions: {
        followChannel: vi.fn(),
        onFollow: (cb: FollowCallback) => {
          callback = cb;
        },
      },
    },
  };
  return { fire: (didFollow: boolean, channel: string) => callback(didFollow, channel) };
};

describe('useFollowedChannels', () => {
  afterEach(() => {
    delete (globalThis as { Twitch?: unknown }).Twitch;
  });

  it('records a channel once the viewer completes a follow', () => {
    const { fire } = stubHelper();
    const { result } = renderHook(() => useFollowedChannels());

    expect(result.current.has('alice')).toBe(false);
    act(() => fire(true, 'alice'));
    expect(result.current.has('alice')).toBe(true);
  });

  it('ignores follow prompts the viewer declined', () => {
    const { fire } = stubHelper();
    const { result } = renderHook(() => useFollowedChannels());

    act(() => fire(false, 'bob'));
    expect(result.current.has('bob')).toBe(false);
  });

  it('stays empty when the Twitch helper is unavailable', () => {
    const { result } = renderHook(() => useFollowedChannels());
    expect(result.current.size).toBe(0);
  });
});
