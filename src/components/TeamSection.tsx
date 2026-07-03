import { Text, makeStyles, tokens } from '@fluentui/react-components';
import { MemberList } from './MemberList';
import { RosterSkeleton } from './RosterSkeleton';
import { useTeamMembers } from '../data/useTeamMembers';
import type { TeamHeader, TwitchAuth } from '../twitch/types';

const useStyles = makeStyles({
  // Fills the scroll body (height:100%) so the member list flexes to the panel's bottom. The
  // team's banner/title now lives in the sticky header (see TeamList), so this is members-only.
  section: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
  },
  // Roster count, pinned above the scrolling list (like GitHub's "N repositories").
  count: {
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalXS,
  },
});

/** Props for {@link TeamSection}. */
export interface TeamSectionProps {
  readonly auth: TwitchAuth | null;
  readonly header: TeamHeader;
}

/**
 * One team's member list. Members are loaded lazily here (via {@link useTeamMembers}) since only
 * the active tab mounts a section. The team's branding is rendered by {@link TeamList} in the
 * sticky header, so this covers just the loading, error, and ready states of the roster itself.
 */
export const TeamSection = ({ auth, header }: TeamSectionProps) => {
  const styles = useStyles();
  const members = useTeamMembers(auth, header.id);
  return (
    <section className={styles.section}>
      {members.status === 'loading' && <RosterSkeleton />}
      {members.status === 'error' && (
        <Text role="alert">Couldn't load this team's members right now.</Text>
      )}
      {members.status === 'ready' && (
        <>
          <Text className={styles.count} size={200} weight="semibold" role="status">
            {members.members.length} {members.members.length === 1 ? 'member' : 'members'}
          </Text>
          <MemberList auth={auth} members={members.members} />
        </>
      )}
    </section>
  );
};
