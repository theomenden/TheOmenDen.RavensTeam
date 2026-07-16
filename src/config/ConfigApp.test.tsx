import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfigApp } from './ConfigApp';
import { DEFAULT_SETTINGS } from '../settings/model';

const save = vi.fn();

// Both config surfaces render without the Twitch helper; stub the hooks they lean on.
vi.mock('../twitch/useTwitchAuth', () => ({
  useTwitchAuth: () => ({ auth: null, theme: 'dark' as const }),
}));
vi.mock('../settings/useConfiguration', () => ({
  useConfiguration: () => ({ broadcasterSettings: DEFAULT_SETTINGS, save }),
}));

describe('ConfigApp', () => {
  it('exposes the page as a main landmark with a top-level heading', () => {
    render(<ConfigApp />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Panel settings/i);
  });

  // The confirmation appears after the page mounts. A live region only announces changes that
  // happen while it is already in the DOM, so it must be present with nothing to say yet.
  it('mounts the save-confirmation live region before there is anything to confirm', () => {
    render(<ConfigApp />);

    const region = screen.getByRole('status');
    expect(region).toBeInTheDocument();
    expect(region).toBeEmptyDOMElement();
  });

  it('confirms in that same live region after saving', () => {
    render(<ConfigApp />);

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    expect(save).toHaveBeenCalledWith(DEFAULT_SETTINGS);
  });

  // The tick is a decorative icon, not a "✓" in the copy — a screen reader should hear "Saved",
  // not "Saved check mark".
  it('keeps the tick out of the announced text', () => {
    render(<ConfigApp />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByRole('status').textContent).toBe('Saved');
  });

  it('clears the confirmation once the draft changes again', () => {
    render(<ConfigApp />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved');

    fireEvent.change(screen.getByRole('combobox', { name: /theme/i }), {
      target: { value: 'dark' },
    });

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('frames the live variant as applying to live viewers', () => {
    render(<ConfigApp variant="live" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Live panel controls/i);
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });

  // The broadcaster surfaces carry the same policy links as the viewer drawer.
  describe.each([['config'], ['live']] as const)('%s policy links', (variant) => {
    it('links to both policies, opening off-site in a new tab', () => {
      render(<ConfigApp variant={variant} />);

      expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
        'href',
        'https://www.theomenden.com/policies/privacy-policy',
      );
      expect(screen.getByRole('link', { name: 'ToS' })).toHaveAttribute(
        'href',
        'https://www.theomenden.com/policies/terms-of-service',
      );

      // Twitch sandboxes the config iframe and blocks top-level navigation, so an in-place link
      // would silently do nothing.
      for (const link of screen.getAllByRole('link')) {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });
});
