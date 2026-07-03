import { memo, useCallback } from 'react';
import { Avatar, Button, Link, makeStyles, motionTokens, tokens } from '@fluentui/react-components';
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

// Twitch's heart glyph — the platform's universal "follow" affordance. Inlined so we don't pull in
// the whole `@fluentui/react-icons` package for two icons. Outline = not yet followed, filled =
// following (mirrors Twitch's own follow control).
const HeartOutlineIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
  </svg>
);
const HeartFilledIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

/** Props for {@link MemberRow}. */
export interface MemberRowProps {
  readonly member: TeamMember;
  /** Resolved avatar URL, or `null` to fall back to initials. */
  readonly avatarUrl: string | null;
  readonly isLive: boolean;
  /** Whether the viewer already follows this channel (as far as the panel can tell — see
   *  {@link useFollowedChannels}). Flips the button to a disabled "Following" state. */
  readonly isFollowing: boolean;
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
    <div className={styles.row}>
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
        icon={isFollowing ? <HeartFilledIcon /> : <HeartOutlineIcon />}
        onClick={handleFollow}
        // No `unfollowChannel` helper action exists, so once followed there's nothing to trigger.
        disabled={isFollowing}
        // Distinct accessible name per row so the buttons aren't ambiguous to screen readers.
        aria-label={`${isFollowing ? 'Following' : 'Follow'} ${member.displayName}`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
});
