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
});

/** Props for {@link RosterSkeleton}. */
export interface RosterSkeletonProps {
  /** Placeholder member rows to render. Defaults to 6. */
  readonly rows?: number;
}

/**
 * Loading placeholder shaped like a {@link TeamSection}: a banner bar over a set of
 * member rows (avatar + name line). Uses Fluent's {@link Skeleton}, which handles the
 * shimmer animation, `prefers-reduced-motion`, and busy-state semantics for us.
 */
export const RosterSkeleton = ({ rows = 6 }: RosterSkeletonProps) => {
  const styles = useStyles();
  return (
    <Skeleton className={styles.section} role="status" aria-label="Loading teams">
      <SkeletonItem shape="rectangle" size={64} />
      <div className={styles.rows}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={styles.row}>
            <SkeletonItem shape="circle" size={32} />
            <div className={styles.name}>
              <SkeletonItem />
            </div>
          </div>
        ))}
      </div>
    </Skeleton>
  );
};
