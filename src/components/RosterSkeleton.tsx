import { Skeleton, SkeletonItem, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
    paddingBlock: tokens.spacingVerticalXS,
    paddingInline: tokens.spacingHorizontalS,
  },
  name: {
    // Mirror MemberRow: a name line that doesn't fill the whole row.
    width: '60%',
  },
  follow: {
    // Mirror MemberRow's trailing follow button, pinned to the right edge.
    marginInlineStart: 'auto',
    width: '64px',
    flexShrink: 0,
  },
});

/** Props for {@link RosterSkeleton}. */
export interface RosterSkeletonProps {
  /** Placeholder member rows to render. Defaults to 6. */
  readonly rows?: number;
}

/**
 * Loading placeholder for a roster: a set of member rows (avatar + name line). The team's
 * banner/title renders separately in the sticky header, so this is rows-only. Uses Fluent's
 * {@link Skeleton}, which handles the shimmer, `prefers-reduced-motion`, and busy-state for us.
 */
export const RosterSkeleton = ({ rows = 6 }: RosterSkeletonProps) => {
  const styles = useStyles();
  return (
    <Skeleton className={styles.section} role="status" aria-label="Loading teams">
      <div className={styles.rows}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={styles.row}>
            <SkeletonItem shape="circle" size={32} />
            <div className={styles.name}>
              <SkeletonItem />
            </div>
            <div className={styles.follow}>
              <SkeletonItem shape="rectangle" size={24} />
            </div>
          </div>
        ))}
      </div>
    </Skeleton>
  );
};
