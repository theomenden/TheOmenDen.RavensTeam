import { memo } from 'react';
import { Avatar, Link, makeStyles, tokens } from '@fluentui/react-components';
import type { MemberView } from '../twitch/types';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    paddingBlock: tokens.spacingVerticalXS,
    paddingInline: tokens.spacingHorizontalS,
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
  readonly member: MemberView;
}

/**
 * A single team member: an avatar with a live/offline presence dot and a link to their
 * channel. A visually-hidden "(live)" suffix announces status to assistive tech. Memoized
 * so unaffected rows don't re-render when the polled live set changes.
 */
export const MemberRow = memo(function MemberRow({ member }: MemberRowProps) {
  const styles = useStyles();
  return (
    <div className={styles.row}>
      <Avatar
        aria-hidden
        name={member.displayName}
        badge={{ status: member.isLive ? 'available' : 'offline' }}
        {...(member.avatarUrl ? { image: { src: member.avatarUrl } } : {})}
      />
      <Link
        className={styles.name}
        href={`https://twitch.tv/${member.login}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {member.displayName}
        {member.isLive ? <span className={styles.srOnly}> (live)</span> : null}
      </Link>
    </div>
  );
});
