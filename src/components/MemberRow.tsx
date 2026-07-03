import { memo } from 'react';
import { Avatar, Link, makeStyles, motionTokens, tokens } from '@fluentui/react-components';
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
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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

/** Props for {@link MemberRow}. */
export interface MemberRowProps {
  readonly member: TeamMember;
  /** Resolved avatar URL, or `null` to fall back to initials. */
  readonly avatarUrl: string | null;
  readonly isLive: boolean;
}

/**
 * A single team member: an avatar with a live/offline presence dot and a link to their channel.
 * A visually-hidden "(live)" suffix announces status to assistive tech. Live status and avatar
 * arrive as primitive props (not a merged object) so {@link memo} skips rows whose own data is
 * unchanged — scrolling the virtualized list doesn't re-render settled rows.
 */
export const MemberRow = memo(function MemberRow({ member, avatarUrl, isLive }: MemberRowProps) {
  const styles = useStyles();
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
    </div>
  );
});
