import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { MemberRow } from './MemberRow';
import { asUserId, type TeamMember } from '../twitch/types';

const alice: TeamMember = {
  userId: asUserId('42'),
  login: 'alice',
  displayName: 'Alice',
  avatarUrl: null,
};

const renderRow = (isLive: boolean, isFollowing = false) =>
  render(
    <FluentProvider theme={webLightTheme}>
      <MemberRow
        member={alice}
        avatarUrl={null}
        isLive={isLive}
        isFollowing={isFollowing}
        zebra={false}
      />
    </FluentProvider>,
  );

describe('MemberRow', () => {
  afterEach(() => {
    delete (globalThis as { Twitch?: unknown }).Twitch;
  });

  it('links to the member channel', () => {
    renderRow(false);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://twitch.tv/alice');
  });

  it('announces live members and omits the marker when offline', () => {
    renderRow(true);
    expect(screen.getByRole('link')).toHaveTextContent(/Alice \(live\)/i);
  });

  it('does not mark offline members as live', () => {
    renderRow(false);
    expect(screen.getByRole('link')).not.toHaveTextContent(/\(live\)/i);
  });

  it('prompts the Twitch follow dialog for the member on click', () => {
    const followChannel = vi.fn();
    (globalThis as { Twitch?: unknown }).Twitch = { ext: { actions: { followChannel } } };

    renderRow(false);
    fireEvent.click(screen.getByRole('button', { name: /follow alice/i }));

    expect(followChannel).toHaveBeenCalledWith('alice');
  });

  it('shows a disabled "Following" button when the viewer already follows', () => {
    renderRow(false, true);
    const button = screen.getByRole('button', { name: /following alice/i });
    expect(button).toHaveTextContent(/following/i);
    expect(button).toBeDisabled();
  });

  it('explains the follow action via a native title tooltip', () => {
    renderRow(false);
    expect(screen.getByRole('button', { name: /follow alice/i })).toHaveAttribute(
      'title',
      'Follow Alice on Twitch.',
    );
  });
});
