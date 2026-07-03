import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { makeStyles, mergeClasses, motionTokens } from '@fluentui/react-components';
import { MemberRow } from './MemberRow';
import { useAvatars } from '../data/useAvatars';
import { useLiveStatus } from '../data/useLiveStatus';
import { useDebounced } from '../data/useDebounced';
import { asUserId, type TeamMember, type TwitchAuth } from '../twitch/types';

/** Estimated row height (px) fed to the virtualizer. */
const ROW_HEIGHT = 44;

/** Settle time before fetching data for a newly-scrolled-to window. */
const SCROLL_SETTLE_MS = 150;

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
  // Opacity-only so it composes with the virtualizer's inline translateY on the same element
  // (animating transform here would clobber row positioning).
  rowEnter: {
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animationDuration: `${motionTokens.durationNormal}ms`,
    animationTimingFunction: motionTokens.curveEasyEase,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' },
  },
});

/** Props for {@link MemberList}. */
export interface MemberListProps {
  readonly auth: TwitchAuth | null;
  readonly members: readonly TeamMember[];
}

/**
 * Virtualized, memoized list of a team's members. Only rows in view are mounted, and avatars +
 * live status are fetched only for that visible window (debounced so scrolling doesn't spam
 * Helix). A large roster therefore costs ~one small request per view instead of thousands up front.
 */
export const MemberList = ({ auth, members }: MemberListProps) => {
  const styles = useStyles();
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: members.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });

  const items = virtualizer.getVirtualItems();

  // Ids for the rows currently in view (+ overscan). Debounced so we fetch once scrolling settles.
  const visibleKey = items.map((item) => members[item.index]?.userId ?? '').join(',');
  const settledKey = useDebounced(visibleKey, SCROLL_SETTLE_MS);
  const visibleIds = useMemo(
    () => (settledKey ? settledKey.split(',').filter(Boolean).map(asUserId) : []),
    [settledKey],
  );

  const avatars = useAvatars(auth, visibleIds);
  const liveIds = useLiveStatus(auth, visibleIds);

  return (
    <div ref={scrollRef} className={styles.scroll}>
      <div
        className={styles.sizer}
        role="list"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {items.map((item, i) => {
          const member = members[item.index];
          if (!member) return null;
          return (
            <div
              key={member.userId}
              className={mergeClasses(styles.row, styles.rowEnter)}
              role="listitem"
              // Virtualization mounts only visible rows; setsize/posinset let assistive tech
              // report the true total and each member's position anyway (WCAG 1.3.1).
              aria-setsize={members.length}
              aria-posinset={item.index + 1}
              // Stagger by position in the visible window so the delay stays bounded (~10 rows).
              style={{
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
                animationDelay: `${i * 30}ms`,
              }}
            >
              <MemberRow
                member={member}
                avatarUrl={avatars.get(member.userId) ?? member.avatarUrl}
                isLive={liveIds.has(member.userId)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
