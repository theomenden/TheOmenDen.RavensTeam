import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { RosterSkeleton } from './RosterSkeleton';

const renderSkeleton = (rows?: number) =>
  render(
    <FluentProvider theme={webLightTheme}>
      <RosterSkeleton {...(rows === undefined ? {} : { rows })} />
    </FluentProvider>,
  );

describe('RosterSkeleton', () => {
  it('exposes a loading label for assistive tech', () => {
    renderSkeleton();
    expect(screen.getByLabelText('Loading teams')).toBeInTheDocument();
  });

  it('is purely presentational (no text for screen readers to read out)', () => {
    const { container } = renderSkeleton(3);
    expect(container.textContent).toBe('');
  });
});
