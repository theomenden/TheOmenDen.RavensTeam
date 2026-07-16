import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  Button,
  Link,
  Text,
  makeStyles,
  tokens,
  useFocusFinders,
  useModalAttributes,
} from '@fluentui/react-components';
import { DismissRegular, OpenRegular, SettingsRegular } from '@fluentui/react-icons';
import { SettingsControls } from './SettingsControls';
import type { PanelSettings } from './model';

const useStyles = makeStyles({
  // Small icon-only trigger pinned to the panel's top-right corner, above the branded header.
  // The gear sits on colorBrandBackground2, which is a *light* tint in the light theme — so the
  // OnBrand (white) foreground this used to force scored 1.44:1 against it, well under WCAG AA's
  // 3:1 for non-text, on the only control that opens settings. colorNeutralForeground1 is the
  // foreground Fluent pairs with that surface, and is what the team title on the same bar already
  // resolves to, so the gear now tracks the bar the way the rest of the header does.
  gear: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    zIndex: 3,
    minWidth: 'auto',
    color: tokens.colorNeutralForeground1,
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
  // Legal links sit on the drawer's bottom edge. marginTop:auto absorbs the slack so they stay put
  // however tall the controls above them get; the rule separates them from the settings proper.
  legal: {
    marginTop: 'auto',
    paddingTop: tokens.spacingVerticalM,
    display: 'flex',
    columnGap: tokens.spacingHorizontalM,
    alignItems: 'center',
    borderTopWidth: tokens.strokeWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
  },
  legalLink: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXXS,
    fontSize: tokens.fontSizeBase200,
  },
  // Fluent's unsized icons are 1em, so this rides the link's font size (and the text-size setting)
  // without a hardcoded px. flexShrink guards it against being squashed if the label wraps.
  externalIcon: {
    flexShrink: 0,
  },
});

/**
 * Off-site policy links shown at the foot of the drawer.
 *
 * Twitch sandboxes the panel iframe and blocks top-level navigation, so these can only open in a
 * new tab — hence target="_blank" (the same reason the roster's twitch.tv links use it). Both URLs
 * must also be declared on the version submission, per extension guidelines 2.12 ("You must provide
 * all URLs that are fetched by the Extension front end on each version submission").
 */
const POLICY_LINKS = [
  { name: 'Privacy Policy', href: 'https://www.theomenden.com/policies/privacy-policy' },
  { name: 'ToS', href: 'https://www.theomenden.com/policies/terms-of-service' },
] as const satisfies readonly { name: string; href: string }[];

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
        icon={<SettingsRegular />}
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
          icon={<DismissRegular />}
          aria-label="Close settings"
          onClick={onClose}
        />
      </div>
      <SettingsControls value={settings} onChange={setOverride} />
      <Button appearance="secondary" size="small" onClick={reset}>
        Reset to channel defaults
      </Button>
      {/* ponytail: density rides the global spacing-token scale; per-avatar sizing skipped until asked */}
      <footer className={styles.legal}>
        {POLICY_LINKS.map((link) => (
          <Link
            key={link.href}
            className={styles.legalLink}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            // Native title rather than Fluent's Tooltip: Tooltip portals, which greys out the whole
            // panel in this iframe (same reason the team picker is a native select). Names the
            // destination and the new tab up front, so following the link is never a surprise.
            title={`${link.name} — opens theomenden.com in a new tab`}
          >
            {link.name}
            {/* Conventional "this leaves the site" marker. Decorative — the link text and title
                carry the meaning, and Fluent's icons are aria-hidden by default. */}
            <OpenRegular className={styles.externalIcon} />
          </Link>
        ))}
      </footer>
    </div>
  );
};
