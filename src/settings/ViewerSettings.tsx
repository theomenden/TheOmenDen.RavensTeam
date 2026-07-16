import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  Button,
  Text,
  makeStyles,
  tokens,
  useFocusFinders,
  useModalAttributes,
} from '@fluentui/react-components';
import { SettingsControls } from './SettingsControls';
import type { PanelSettings } from './model';

const useStyles = makeStyles({
  // Small icon-only trigger pinned to the panel's top-right corner, above the branded header.
  gear: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    zIndex: 3,
    minWidth: 'auto',
    color: tokens.colorNeutralForegroundOnBrand,
  },
  // Inline overlay (NOT a portal — portals grey out the overflow:hidden iframe). Slides over
  // the roster from the right; the panel root is position:relative so this anchors to it.
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
    width: '84%',
    maxWidth: '260px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    minWidth: 'auto',
  },
});

/** Gear cog glyph (inline SVG — the project has no icon dependency). */
const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M19.4 13a7.5 7.5 0 0 0 0-2l1.7-1.3-1.5-2.6-2 .8a7.6 7.6 0 0 0-1.7-1L15.5 3h-3l-.4 2.9a7.6 7.6 0 0 0-1.7 1l-2-.8-1.5 2.6L4.6 11a7.5 7.5 0 0 0 0 2l-1.7 1.3 1.5 2.6 2-.8c.5.42 1.1.76 1.7 1l.4 2.9h3l.4-2.9c.6-.24 1.2-.58 1.7-1l2 .8 1.5-2.6L19.4 13Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

/** Dismiss "×" glyph (inline SVG). */
const DismissIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Props for {@link ViewerSettings}. */
export interface ViewerSettingsProps {
  /** The viewer's current effective settings (what the controls display). */
  readonly settings: PanelSettings;
  /** Sets one field as a viewer override. */
  readonly setOverride: <K extends keyof PanelSettings>(key: K, value: PanelSettings[K]) => void;
  /** Clears every viewer override, reverting to the channel defaults. */
  readonly reset: () => void;
}

/**
 * The viewer's in-panel settings affordance: a gear button that opens an inline drawer of
 * {@link SettingsControls}. Changes are written as viewer overrides; "Reset to channel
 * defaults" clears them.
 *
 * The drawer is a real modal dialog: focus moves into it on open, is trapped while it is open, and
 * returns to the gear on close. That comes from Fluent's tabster modalizer rather than Fluent's
 * Drawer, which is unusable here — OverlayDrawer is Dialog-based and portals (the grey-slab bug in
 * this panel's overflow:hidden iframe), and InlineDrawer animates its own width in-flow, which
 * fights the absolute overlay. These are the same primitives Fluent's Dialog uses internally.
 */
export const ViewerSettings = ({ settings, setOverride, reset }: ViewerSettingsProps) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);

  // triggerAttributes marks the gear (and is what sends focus back here on close); modalAttributes
  // fences focus into the drawer. Both halves must come from the same call.
  const { modalAttributes, triggerAttributes } = useModalAttributes({
    trapFocus: true,
    legacyTrapFocus: true,
  });

  return (
    <>
      {/* Stays mounted while the drawer is open (the drawer covers it) so focus has a live element
          to return to — an unmounted trigger has nothing to restore to. */}
      <Button
        className={styles.gear}
        appearance="subtle"
        size="small"
        icon={<GearIcon />}
        aria-label="Panel settings"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        {...triggerAttributes}
      />
      {open && (
        <SettingsDrawer
          settings={settings}
          setOverride={setOverride}
          reset={reset}
          onClose={() => setOpen(false)}
          modalAttributes={modalAttributes}
        />
      )}
    </>
  );
};

/** Props for {@link SettingsDrawer}. */
interface SettingsDrawerProps extends ViewerSettingsProps {
  readonly onClose: () => void;
  readonly modalAttributes: ReturnType<typeof useModalAttributes>['modalAttributes'];
}

/**
 * The open drawer. Split from {@link ViewerSettings} only so the focus-on-open effect lives in a
 * component that mounts with the drawer — no effect guard needed, and no stale run when it is shut.
 */
const SettingsDrawer = ({
  settings,
  setOverride,
  reset,
  onClose,
  modalAttributes,
}: SettingsDrawerProps) => {
  const styles = useStyles();

  // The modalizer fences focus in but does not move it. Without this the drawer opens with focus
  // left behind on the gear, outside the trap, so the first Tab walks the roster instead of the
  // settings. Fluent's own Dialog pairs the modalizer with the same focus-first step.
  // Verified in a browser — happy-dom does not run tabster, so no unit test covers this.
  const drawerRef = useRef<HTMLDivElement>(null);
  const { findFirstFocusable } = useFocusFinders();
  useEffect(() => {
    if (drawerRef.current) findFirstFocusable(drawerRef.current)?.focus();
  }, [findFirstFocusable]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') onClose();
  };

  return (
    // Exactly one tabster attribute may land here: modalAttributes and the useRestoreFocus* hooks
    // both write data-tabster, so spreading both silently drops the first and the trap never
    // installs. Restore needs no extra hook — modalAttributes already carries it, paired with
    // triggerAttributes on the gear. This is how Fluent's Dialog does it (DialogSurface carries
    // modalAttributes and nothing else).
    <div
      ref={drawerRef}
      className={styles.drawer}
      role="dialog"
      aria-modal="true"
      aria-label="Panel settings"
      onKeyDown={onKeyDown}
      {...modalAttributes}
    >
      <div className={styles.header}>
        <Text weight="semibold" size={400}>
          Settings
        </Text>
        <Button
          className={styles.closeButton}
          appearance="subtle"
          size="small"
          icon={<DismissIcon />}
          aria-label="Close settings"
          onClick={onClose}
        />
      </div>
      <SettingsControls value={settings} onChange={setOverride} />
      <Button appearance="secondary" size="small" onClick={reset}>
        Reset to channel defaults
      </Button>
      {/* ponytail: density rides the global spacing-token scale; per-avatar sizing skipped until asked */}
    </div>
  );
};
