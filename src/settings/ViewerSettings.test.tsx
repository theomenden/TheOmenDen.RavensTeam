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

  it('closes the drawer from its close button', () => {
    renderSettings();
    fireEvent.click(gear());

    fireEvent.click(screen.getByRole('button', { name: 'Close settings' }));

    expect(drawer()).not.toBeInTheDocument();
    expect(gear()).toHaveAttribute('aria-expanded', 'false');
  });

  // Focus behaviour itself is tabster's, and tabster does not run under happy-dom — the trap and
  // the return-to-gear were verified in a browser instead. What is worth pinning here is the
  // wiring, because the failure mode is silent: modalAttributes and the useRestoreFocus* hooks all
  // write data-tabster, so spreading two of them onto one element drops the modalizer and the trap
  // never installs, with nothing visibly broken until a keyboard user tabs out of the dialog.
  it('installs the focus trap on the drawer', () => {
    renderSettings();
    fireEvent.click(gear());

    const tabster = drawer()!.getAttribute('data-tabster');
    expect(tabster).toContain('modalizer');
    expect(JSON.parse(tabster!).modalizer.isTrapped).toBe(true);
  });

  it('marks the gear as the modal trigger, so focus can return to it', () => {
    renderSettings();
    fireEvent.click(gear());

    expect(gear()).toHaveAttribute('data-tabster');
    expect(gear()).toBeInTheDocument();
    expect(gear()).toHaveAttribute('aria-expanded', 'true');
  });
});
