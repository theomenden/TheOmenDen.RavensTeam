import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { MemberRow } from './MemberRow';
import { asUserId, type TeamMember } from '../twitch/types';

const alice: TeamMember = {
  userId: asUserId('42'),
  login: 'alice',
  displayName: 'Alice',
  avatarUrl: null,
};

const renderRow = (isLive: boolean) =>
  render(
    <FluentProvider theme={webLightTheme}>
      <MemberRow member={alice} avatarUrl={null} isLive={isLive} />
    </FluentProvider>,
  );

describe('MemberRow', () => {
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
});
