import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { TeamList } from './TeamList';

// TeamList's landmarks are the point of this file, not its data. Stub the fetching hooks so the
// component renders its chrome without Helix or the Twitch helper.
vi.mock('../data/useTeams', () => ({ useTeams: () => ({ status: 'loading' as const }) }));
vi.mock('../data/useFollowedChannels', () => ({ useFollowedChannels: () => new Set<string>() }));

describe('TeamList landmarks', () => {
  // <header> only maps to role="banner" while it sits outside <main>/<section>/<article>; nesting it
  // silently demotes it to a plain section header. testing-library resolves <header> to "banner"
  // regardless of nesting, so getByRole below is only a locator — the containment assertion is what
  // actually pins the structure, and it is the line that fails if the header moves inside <main>.
  it('keeps the brand bar a top-level banner, outside the roster main', () => {
    render(
      <FluentProvider theme={webLightTheme}>
        <TeamList auth={null} />
      </FluentProvider>,
    );

    const banner = screen.getByRole('banner');
    const main = screen.getByRole('main');

    expect(banner).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(main).not.toContainElement(banner);
  });
});
