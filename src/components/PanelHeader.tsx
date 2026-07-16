import {
  Badge,
  Link,
  Select,
  Text,
  makeStyles,
  motionTokens,
  tokens,
} from '@fluentui/react-components';
import { asTeamId, type TeamHeader, type TeamId } from '../twitch/types';

const useStyles = makeStyles({
  // Full-bleed top header that floats above the roster. Never shrinks, so it stays put while the
  // roster scrolls beneath it. Negative margins cancel the panel's padding on the top + sides (see
  // App `panel`, which pads with these same two tokens) so the bar spans the whole panel width and
  // sits flush to the top edge — the list keeps the panel's side gutter. Tokens rather than a
  // literal 8px: density scales the spacing ramp (see buildTheme), so the cancellation has to scale
  // with it or the bar drifts out of alignment in compact mode.
  // position + zIndex lift it into its own layer above the list.
  header: {
    flexShrink: 0,
    marginTop: `calc(-1 * ${tokens.spacingVerticalS})`,
    marginInline: `calc(-1 * ${tokens.spacingHorizontalS})`,
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
    paddingBlock: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalM,
  },
  // Headline (banner or title) wrapper. Keyed by team in the JSX so it crossfades in on change.
  hero: {
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animationDuration: `${motionTokens.durationNormal}ms`,
    animationTimingFunction: motionTokens.curveEasyEase,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' },
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
  // Full-bleed: the banner spans the whole brand bar edge-to-edge. Negative inline margins + a
  // matching width cancel brandBlock's horizontal padding so there are no side gutters, and the
  // corners stay square to match the squared brand bar. Height is capped (object-fit crops to
  // cover) so a wide team banner can't dominate the short ~496px panel.
  banner: {
    display: 'block',
    width: `calc(100% + (2 * ${tokens.spacingHorizontalM}))`,
    marginInline: `calc(-1 * ${tokens.spacingHorizontalM})`,
    height: 'auto',
    maxHeight: '88px',
    objectFit: 'cover',
    objectPosition: 'center',
  },
  // Live region for the member count, right-aligned below the team dropdown. Always mounted, even
  // with no count to show: a role="status" element inserted into the DOM at the same moment as its
  // text is not reliably announced — the region has to already exist for the insertion to register
  // as a change. Reserving the chip's height also stops the brand bar reflowing when it resolves.
  countRegion: {
    alignSelf: 'flex-end',
    marginTop: tokens.spacingVerticalXS,
    minHeight: tokens.lineHeightBase200,
  },
  // Fades in when the count resolves. Badge owns the pill's shape, colour, and type ramp.
  count: {
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animationDuration: `${motionTokens.durationFast}ms`,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' },
  },
  // Compact team picker, now inside the solid brand bar: the brand block's own padding insets it
  // and it stretches to the bar's content width (flex-column default). marginTop separates it from
  // the title (the block's row gap is deliberately tight). A native <select> (Fluent Select) is used
  // instead of Dropdown on purpose: Dropdown portals its listbox, and in the panel's overflow:hidden
  // iframe that portal inherits the FluentProvider background and covers the whole panel grey. The
  // native control's option list is drawn by the browser, so it can't be clipped by the iframe.
  teamSelect: {
    marginTop: tokens.spacingVerticalS,
  },
});

/** Props for {@link PanelHeader}. */
export interface PanelHeaderProps {
  /** Teams available to pick from — empty while the team fetch is loading or errored. */
  readonly teams: readonly TeamHeader[];
  /** Controlled dropdown selection; `[]` means no team is picked yet. */
  readonly selected: readonly TeamId[];
  readonly onSelect: (ids: readonly TeamId[]) => void;
  /** Active team's member count, shown right-aligned below the dropdown; `null` while it loads. */
  readonly memberCount?: number | null;
}

/**
 * The panel's always-on top bar: the "Raven's Team" brand block plus a dropdown to pick a team.
 * Rendered in every state (loading, error, ready) so the panel always has a stable header; the
 * dropdown is disabled until teams load and starts with an empty selection (no team preselected).
 */
export const PanelHeader = ({ teams, selected, onSelect, memberCount }: PanelHeaderProps) => {
  const styles = useStyles();
  const active = teams.find((team) => team.id === selected[0]);
  const countLabel =
    memberCount == null ? null : `${memberCount} ${memberCount === 1 ? 'member' : 'members'}`;

  const onTeamChange = (_: unknown, data: { value: string }): void => {
    onSelect(data.value ? [asTeamId(data.value)] : []);
  };

  return (
    <header className={styles.header}>
      <div className={styles.brandBlock}>
        {/* Keyed by team so the headline (banner or title) remounts and crossfades in on change. */}
        <div className={styles.hero} key={active?.id ?? 'none'}>
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
                <Text className={styles.title} as="h2" weight="bold" size={400}>
                  {active.displayName}
                </Text>
              )}
            </Link>
          ) : (
            <Text className={styles.placeholder} as="h2" weight="bold" size={400}>
              Select a team
            </Text>
          )}
        </div>
        <Select
          className={styles.teamSelect}
          aria-label="Select a team"
          value={active?.id ?? ''}
          onChange={onTeamChange}
          disabled={teams.length === 0}
          appearance="underline"
        >
          {/* Placeholder only matters before a team is picked; once teams load the parent
              auto-selects the first, so this is normally superseded. */}
          <option value="" disabled>
            Select a team
          </option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.displayName}
            </option>
          ))}
        </Select>
        <div className={styles.countRegion} role="status">
          {/* color="important" is Fluent's stand-out neutral (black-on-light, white-on-dark), so the
              chip keeps its contrast against the brand bar in every theme — the job the old
              hand-rolled black scrim did, but token-driven instead of a fixed rgba(). */}
          {countLabel && (
            <Badge className={styles.count} appearance="filled" color="important" shape="rounded">
              {countLabel}
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
};
