import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { MemberRow } from './MemberRow';
import { asUserId, type MemberView } from '../twitch/types';

const view = (isLive: boolean): MemberView => ({
  userId: asUserId('42'),
  login: 'alice',
  displayName: 'Alice',
  avatarUrl: null,
  isLive,
});

const renderRow = (member: MemberView) =>
  render(
    <FluentProvider theme={webLightTheme}>
      <MemberRow member={member} />
    </FluentProvider>,
  );

describe('MemberRow', () => {
  it('links to the member channel', () => {
    renderRow(view(false));
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://twitch.tv/alice');
  });

  it('announces live members and omits the marker when offline', () => {
    renderRow(view(true));
    expect(screen.getByRole('link')).toHaveTextContent(/Alice \(live\)/i);
  });

  it('does not mark offline members as live', () => {
    renderRow(view(false));
    expect(screen.getByRole('link')).not.toHaveTextContent(/\(live\)/i);
  });
});
