import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { makeStyles } from '@fluentui/react-components';
import { mergeLiveStatus } from '../data/merge';
import { MemberRow } from './MemberRow';
import type { TeamMember, UserId } from '../twitch/types';

/** Estimated row height (px) fed to the virtualizer. */
const ROW_HEIGHT = 44;

const useStyles = makeStyles({
  scroll: {
    overflowY: 'auto',
    maxHeight: '320px',
  },
  sizer: {
    position: 'relative',
    width: '100%',
  },
  row: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
  },
});

/** Props for {@link MemberList}. */
export interface MemberListProps {
  readonly members: readonly TeamMember[];
  readonly liveIds: ReadonlySet<UserId>;
}

/**
 * Virtualized, memoized list of a team's members: only rows in view are mounted, so a large
 * roster stays smooth in the narrow panel. The live join is a memoized {@link mergeLiveStatus}
 * so the list recomputes only when members or the live set change.
 */
export const MemberList = ({ members, liveIds }: MemberListProps) => {
  const styles = useStyles();
  const scrollRef = useRef<HTMLDivElement>(null);

  const views = useMemo(() => mergeLiveStatus(members, liveIds), [members, liveIds]);

  const virtualizer = useVirtualizer({
    count: views.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });

  return (
    <div ref={scrollRef} className={styles.scroll}>
      <div
        className={styles.sizer}
        role="list"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const member = views[item.index];
          if (!member) return null;
          return (
            <div
              key={member.userId}
              className={styles.row}
              role="listitem"
              // Virtualization mounts only visible rows; setsize/posinset let assistive tech
              // report the true total and each member's position anyway (WCAG 1.3.1).
              aria-setsize={views.length}
              aria-posinset={item.index + 1}
              style={{ height: `${item.size}px`, transform: `translateY(${item.start}px)` }}
            >
              <MemberRow member={member} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
