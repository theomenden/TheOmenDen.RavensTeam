import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { PanelHeader } from './PanelHeader';
import { asTeamId, type TeamHeader } from '../twitch/types';

const ravens: TeamHeader = {
  id: asTeamId('7'),
  name: 'ravens',
  displayName: 'Ravens',
  bannerUrl: null,
};

const renderHeader = (memberCount?: number | null) =>
  render(
    <FluentProvider theme={webLightTheme}>
      <PanelHeader
        teams={[ravens]}
        selected={[ravens.id]}
        onSelect={vi.fn()}
        {...(memberCount === undefined ? {} : { memberCount })}
      />
    </FluentProvider>,
  );

describe('PanelHeader', () => {
  // Pins the brand bar to a real <header> rather than a div. Whether that <header> ends up an
  // actual banner landmark depends on where it sits — TeamList.test.tsx covers that.
  it('renders the brand bar as a header element', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  // The count arrives after the header mounts. A live region only announces changes that happen
  // while it is already in the DOM, so it must be present even with nothing to say yet.
  it('mounts the count live region before a count exists', () => {
    renderHeader(null);
    const region = screen.getByRole('status');
    expect(region).toBeInTheDocument();
    expect(region).toBeEmptyDOMElement();
  });

  it('announces the member count in that same live region', () => {
    renderHeader(12);
    expect(screen.getByRole('status')).toHaveTextContent('12 members');
  });

  it('singularizes a one-member team', () => {
    renderHeader(1);
    expect(screen.getByRole('status')).toHaveTextContent('1 member');
  });
});
