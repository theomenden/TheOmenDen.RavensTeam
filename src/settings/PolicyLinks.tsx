import { Link, makeStyles, tokens } from '@fluentui/react-components';
import { OpenRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  // Sits on the trailing edge of whatever column holds it: marginTop:auto absorbs the slack in the
  // viewer drawer (a fixed-height flex column, so the links pin to the bottom) and is simply inert
  // on the config pages, which grow to fit — so one component serves both without a variant.
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
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXXS,
    fontSize: tokens.fontSizeBase200,
    // WCAG 2.5.8 target size. At 12px these run ~20px tall, which only clears the bar via the
    // spacing exception (a 24px circle on each doesn't reach the other). That holds today but
    // breaks the moment a third link lands beside them — and these are tapped on Twitch mobile,
    // so give them the 24px outright instead of leaning on the gap between them.
    minHeight: '24px',
  },
  // Fluent's unsized icons are 1em, so this rides the link's font size (and the text-size setting)
  // without a hardcoded px. flexShrink guards it against being squashed if the label wraps.
  icon: {
    flexShrink: 0,
  },
});

/**
 * Off-site policy links, shown on every settings surface (viewer drawer, config, live config).
 *
 * Twitch sandboxes the extension iframes and blocks top-level navigation, so these can only open
 * in a new tab — hence target="_blank" (the same reason the roster's twitch.tv links use it).
 * Both URLs must also be declared on the version submission, per extension guidelines 2.12 ("You
 * must provide all URLs that are fetched by the Extension front end on each version submission").
 */
const POLICY_LINKS = [
  { name: 'Privacy Policy', href: 'https://www.theomenden.com/policies/privacy-policy' },
  { name: 'ToS', href: 'https://www.theomenden.com/policies/terms-of-service' },
] as const satisfies readonly { name: string; href: string }[];

/** Renders the policy links as a footer row. */
export const PolicyLinks = () => {
  const styles = useStyles();
  return (
    <footer className={styles.legal}>
      {POLICY_LINKS.map((link) => (
        <Link
          key={link.href}
          className={styles.link}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          // Native title rather than Fluent's Tooltip: Tooltip portals, which greys out the whole
          // panel in the iframe (same reason the team picker is a native select). Names the
          // destination and the new tab up front, so following the link is never a surprise.
          title={`${link.name} — opens theomenden.com in a new tab`}
        >
          {link.name}
          {/* Conventional "this leaves the site" marker. Decorative — the link text and title
              carry the meaning, and Fluent's icons are aria-hidden by default. */}
          <OpenRegular className={styles.icon} />
        </Link>
      ))}
    </footer>
  );
};
