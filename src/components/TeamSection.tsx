import { Link, Text, makeStyles, tokens } from '@fluentui/react-components';
import { MemberList } from './MemberList';
import type { Team, UserId } from '../twitch/types';

const useStyles = makeStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
  },
  banner: {
    width: '100%',
    height: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    display: 'block',
  },
});

/** Props for {@link TeamSection}. */
export interface TeamSectionProps {
  readonly team: Team;
  readonly liveIds: ReadonlySet<UserId>;
}

/** One team: a clickable banner/title linking to the team page, then its member list. */
export const TeamSection = ({ team, liveIds }: TeamSectionProps) => {
  const styles = useStyles();
  const teamUrl = `https://twitch.tv/team/${team.name}`;
  return (
    <section className={styles.section}>
      <Link href={teamUrl} target="_blank" rel="noopener noreferrer" appearance="subtle">
        {team.bannerUrl ? (
          <img className={styles.banner} src={team.bannerUrl} alt={`${team.displayName} team`} />
        ) : (
          <Text as="h2" weight="semibold" size={400}>
            {team.displayName}
          </Text>
        )}
      </Link>
      <MemberList members={team.members} liveIds={liveIds} />
    </section>
  );
};
