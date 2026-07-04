import { useEffect } from 'react';
import { Text, makeStyles } from '@fluentui/react-components';
import { MemberList } from './MemberList';
import { RosterSkeleton } from './RosterSkeleton';
import { useTeamMembers } from '../data/useTeamMembers';
import type { TeamHeader, TwitchAuth } from '../twitch/types';

const useStyles = makeStyles({
  // Fills the scroll body (height:100%) so the member list flexes to the panel's bottom. The
  // team's banner/title + member count now live in the sticky header (see TeamList), so this is
  // members-only.
  section: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
  },
});

/** Props for {@link TeamSection}. */
export interface TeamSectionProps {
  readonly auth: TwitchAuth | null;
  readonly header: TeamHeader;
  /** Logins the viewer follows (via the panel this session), threaded down to each member row. */
  readonly followed: ReadonlySet<string>;
  /** Reports this team's member count up to the header (`null` while loading). Only the visible
   *  team's effect runs (hidden `Activity` tabs suspend theirs), so the header shows the active
   *  team's count. */
  readonly onCountChange?: (count: number | null) => void;
}

/**
 * One team's member list. Members are loaded lazily here (via {@link useTeamMembers}) since only
 * the active tab mounts a section. The team's branding + count are rendered by {@link TeamList} in
 * the sticky header, so this covers just the loading, error, and ready states of the roster itself.
 */
export const TeamSection = ({ auth, header, followed, onCountChange }: TeamSectionProps) => {
  const styles = useStyles();
  const members = useTeamMembers(auth, header.id);
  const count = members.status === 'ready' ? members.members.length : null;

  // Push the count to the header while this section is the visible one; clear it when it hides or
  // unmounts so a stale count from another team never lingers.
  useEffect(() => {
    onCountChange?.(count);
    return () => onCountChange?.(null);
  }, [count, onCountChange]);

  return (
    <section className={styles.section}>
      {members.status === 'loading' && <RosterSkeleton />}
      {members.status === 'error' && (
        <Text role="alert">Couldn't load this team's members right now.</Text>
      )}
      {members.status === 'ready' && (
        <MemberList auth={auth} members={members.members} followed={followed} />
      )}
    </section>
  );
};
