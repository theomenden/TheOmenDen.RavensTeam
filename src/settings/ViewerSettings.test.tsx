import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { ViewerSettings } from './ViewerSettings';
import { DEFAULT_SETTINGS } from './model';

const renderSettings = () =>
  render(
    <FluentProvider theme={webLightTheme}>
      <ViewerSettings settings={DEFAULT_SETTINGS} setOverride={vi.fn()} reset={vi.fn()} />
    </FluentProvider>,
  );

const gear = () => screen.getByRole('button', { name: 'Panel settings' });
const drawer = () => screen.queryByRole('dialog', { name: 'Panel settings' });

describe('ViewerSettings', () => {
  it('opens the drawer from the gear', () => {
    renderSettings();
    expect(drawer()).not.toBeInTheDocument();

    fireEvent.click(gear());

    expect(drawer()).toBeInTheDocument();
  });

  it('closes the drawer on Escape', () => {
    renderSettings();
    fireEvent.click(gear());

    fireEvent.keyDown(drawer()!, { key: 'Escape' });

    expect(drawer()).not.toBeInTheDocument();
  });

  it('leaves the drawer open for other keys', () => {
    renderSettings();
    fireEvent.click(gear());

    fireEvent.keyDown(drawer()!, { key: 'a' });

    expect(drawer()).toBeInTheDocument();
  });

  // The gear is the element focus returns to when the drawer closes, so it has to survive the
  // drawer being open — an unmounted trigger leaves focus stranded on <body>.
  it('keeps the gear trigger mounted while the drawer is open', () => {
    renderSettings();
    fireEvent.click(gear());

    expect(gear()).toBeInTheDocument();
    expect(gear()).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the drawer from its close button', () => {
    renderSettings();
    fireEvent.click(gear());

    fireEvent.click(screen.getByRole('button', { name: 'Close settings' }));

    expect(drawer()).not.toBeInTheDocument();
    expect(gear()).toHaveAttribute('aria-expanded', 'false');
  });
});
