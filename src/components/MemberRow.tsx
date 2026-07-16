import { memo, useCallback } from 'react';
import {
  Avatar,
  Button,
  Link,
  makeStyles,
  mergeClasses,
  motionTokens,
  tokens,
} from '@fluentui/react-components';
import { HeartFilled, HeartRegular } from '@fluentui/react-icons';
import { logger } from '../logger';
import type { TeamMember } from '../twitch/types';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    paddingBlock: tokens.spacingVerticalXS,
    paddingInline: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium,
    transitionProperty: 'transform, box-shadow, background-color',
    transitionDuration: `${motionTokens.durationFast}ms`,
    transitionTimingFunction: motionTokens.curveEasyEase,
    ':hover': {
      transform: 'scale(1.01)',
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: tokens.shadow4,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '1ms',
      ':hover': { transform: 'none' },
    },
  },
  // Zebra striping: every other channel gets a subtly raised surface so rows read as distinct
  // from the get-go, before any hover. The :hover rule above still overrides on interaction.
  rowAlt: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  name: {
    // Grow to fill the row so the follow button is pinned to the trailing edge; minWidth:0 lets
    // this flex item shrink below its content width so the ellipsis actually engages.
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  follow: {
    flexShrink: 0,
    // Drop shadow so the follow CTA pops off the row from the start; deepens + lifts on hover,
    // then presses in on click for a tactile sense of feedback.
    boxShadow: tokens.shadow4,
    transitionProperty: 'box-shadow, transform',
    transitionDuration: `${motionTokens.durationFast}ms`,
    transitionTimingFunction: motionTokens.curveEasyEase,
    ':hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-1px)',
    },
    ':active': {
      boxShadow: tokens.shadow4,
      transform: 'translateY(0) scale(0.96)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '1ms',
      ':hover': { transform: 'none' },
      ':active': { transform: 'none' },
    },
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
  },
});

// The heart is Twitch's universal "follow" affordance: outline = not yet followed, filled =
// following (mirrors Twitch's own follow control). Fluent's unsized icons scale to the Button's
// icon slot on their own, so no width/height is needed here.

/** Props for {@link MemberRow}. */
export interface MemberRowProps {
  readonly member: TeamMember;
  /** Resolved avatar URL, or `null` to fall back to initials. */
  readonly avatarUrl: string | null;
  readonly isLive: boolean;
  /** Whether the viewer already follows this channel (as far as the panel can tell — see
   *  {@link useFollowedChannels}). Flips the button to a disabled "Following" state. */
  readonly isFollowing: boolean;
  /** Alternating-row flag for zebra striping (true = raised surface). */
  readonly zebra: boolean;
}

/**
 * A single team member: an avatar with a live/offline presence dot, a link to their channel, and a
 * trailing "Follow" / "Following" button. A visually-hidden "(live)" suffix announces status to
 * assistive tech. Live status, avatar, and follow state arrive as primitive props (not a merged
 * object) so {@link memo} skips rows whose own data is unchanged — scrolling the virtualized list
 * doesn't re-render settled rows.
 */
export const MemberRow = memo(function MemberRow({
  member,
  avatarUrl,
  isLive,
  isFollowing,
  zebra,
}: MemberRowProps) {
  const styles = useStyles();

  // Twitch's own follow flow: prompts the viewer with a Twitch-controlled dialog. This is the only
  // sanctioned way for an extension to initiate a follow — no Helix write or extra scopes needed.
  const handleFollow = useCallback(() => {
    if (typeof Twitch === 'undefined' || !Twitch.ext?.actions) {
      logger.warn('Follow requested but the Twitch Extension Helper is unavailable.');
      return;
    }
    Twitch.ext.actions.followChannel(member.login);
  }, [member.login]);

  return (
    <div className={mergeClasses(styles.row, zebra && styles.rowAlt)}>
      <Avatar
        aria-hidden
        name={member.displayName}
        badge={{ status: isLive ? 'available' : 'offline' }}
        {...(avatarUrl ? { image: { src: avatarUrl } } : {})}
      />
      <Link
        className={styles.name}
        href={`https://twitch.tv/${member.login}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {member.displayName}
        {isLive ? <span className={styles.srOnly}> (live)</span> : null}
      </Link>
      <Button
        className={styles.follow}
        appearance={isFollowing ? 'subtle' : 'primary'}
        size="small"
        icon={isFollowing ? <HeartFilled /> : <HeartRegular />}
        onClick={handleFollow}
        // No `unfollowChannel` helper action exists, so once followed there's nothing to trigger.
        disabled={isFollowing}
        // Distinct accessible name per row so the buttons aren't ambiguous to screen readers.
        aria-label={`${isFollowing ? 'Following' : 'Follow'} ${member.displayName}`}
        // Native `title` tooltip: Fluent's Tooltip portals and would grey out the panel in the
        // overflow:hidden iframe (same reason the team picker uses a native <select>). The browser
        // draws this above everything, unclipped — a one-line explainer of what clicking does.
        title={
          isFollowing
            ? `You follow ${member.displayName}.`
            : `Follow ${member.displayName} on Twitch.`
        }
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
});
