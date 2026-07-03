import { Dropdown, Link, Option, Text, makeStyles, tokens } from '@fluentui/react-components';
import type { OptionOnSelectData, SelectionEvents } from '@fluentui/react-components';
import type { TeamHeader, TeamId } from '../twitch/types';

const useStyles = makeStyles({
  // Full-bleed top header that floats above the roster. Never shrinks, so it stays put while the
  // roster scrolls beneath it. Negative margins cancel the panel's 8px padding on the top + sides
  // (see App `panel`) so the bar spans the whole panel width and sits flush to the top edge — the
  // list keeps the panel's side gutter. position + zIndex lift it into its own layer above the list.
  header: {
    flexShrink: 0,
    marginTop: '-8px',
    marginInline: '-8px',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalS,
  },
  // Solid, full-width brand bar. Squared (no radius) so it reads as a header bar to the panel
  // edges; the drop shadow lifts it above the scrolling roster (side/top shadow is clipped by the
  // panel's overflow:hidden, so only the bottom edge shows over the list).
  brandBlock: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
    backgroundColor: tokens.colorBrandBackground2,
    boxShadow: tokens.shadow8,
    paddingBlock: tokens.spacingVerticalM,
    paddingInline: tokens.spacingHorizontalM,
  },
  brandLabel: {
    color: tokens.colorBrandForeground1,
  },
  // Team title wraps to as many lines as it needs — no truncation.
  title: {
    overflowWrap: 'break-word',
  },
  // Muted hero shown before a team is picked (dropdown selection is empty).
  placeholder: {
    color: tokens.colorNeutralForeground3,
    overflowWrap: 'break-word',
  },
  banner: {
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: tokens.borderRadiusMedium,
  },
  // Compact team picker. minWidth:0 lets it shrink to the panel; the button truncates a long team
  // name rather than forcing a panel-wide scrollbar. alignSelf:stretch + marginInline fills the
  // full-bleed header but insets the control to line up with the padded roster below. Its own
  // stacking layer keeps the control (and its popover anchor) above the list.
  teamSelect: {
    minWidth: 0,
    alignSelf: 'stretch',
    marginInline: tokens.spacingHorizontalS,
    position: 'relative',
    zIndex: 3,
  },
});

/** Props for {@link PanelHeader}. */
export interface PanelHeaderProps {
  /** Teams available to pick from — empty while the team fetch is loading or errored. */
  readonly teams: readonly TeamHeader[];
  /** Controlled dropdown selection; `[]` means no team is picked yet. */
  readonly selected: readonly TeamId[];
  readonly onSelect: (ids: readonly TeamId[]) => void;
}

/**
 * The panel's always-on top bar: the "Raven's Team" brand block plus a dropdown to pick a team.
 * Rendered in every state (loading, error, ready) so the panel always has a stable header; the
 * dropdown is disabled until teams load and starts with an empty selection (no team preselected).
 */
export const PanelHeader = ({ teams, selected, onSelect }: PanelHeaderProps) => {
  const styles = useStyles();
  const active = teams.find((team) => team.id === selected[0]);

  const onOptionSelect = (_: SelectionEvents, data: OptionOnSelectData): void => {
    if (data.optionValue) onSelect([data.optionValue as TeamId]);
  };

  return (
    <div className={styles.header}>
      <div className={styles.brandBlock}>
        <Text className={styles.brandLabel} size={200} weight="semibold">
          Raven's Team
        </Text>
        {active ? (
          <Link
            href={`https://twitch.tv/team/${active.name}`}
            target="_blank"
            rel="noopener noreferrer"
            appearance="subtle"
          >
            {active.bannerUrl ? (
              <img
                className={styles.banner}
                src={active.bannerUrl}
                alt={`${active.displayName} team`}
              />
            ) : (
              <Text className={styles.title} as="h2" weight="bold" size={600}>
                {active.displayName}
              </Text>
            )}
          </Link>
        ) : (
          <Text className={styles.placeholder} as="h2" weight="bold" size={500}>
            Select a team
          </Text>
        )}
      </div>
      <Dropdown
        className={styles.teamSelect}
        aria-label="Select a team"
        placeholder="Select a team"
        value={active?.displayName ?? ''}
        selectedOptions={[...selected]}
        onOptionSelect={onOptionSelect}
        disabled={teams.length === 0}
        size="small"
      >
        {teams.map((team) => (
          <Option key={team.id} value={team.id} text={team.displayName}>
            {team.displayName}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};
