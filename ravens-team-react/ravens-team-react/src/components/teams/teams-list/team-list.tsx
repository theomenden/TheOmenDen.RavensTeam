// src/components/TeamList.tsx
import React from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { TeamListItem } from './team-list-item';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { makeStyles } from '@fluentui/react-components';
import { useBatchRequests } from '../../../hooks/batch-request-hooks/use-batch-requests';
import { TableSkeleton } from '../../skeletons/initializer-skeleton';
interface TeamListProps {
    members: BasicTwitchUser[][];
}

const renderPersona = (member: TwitchUser, style: React.CSSProperties) => {
    return (<TeamListItem key={member.id} member={member} listStyles={style} />);
};

const useStyles = makeStyles({
    insetList: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

function itemKey(index: number, data: TwitchUser[]): string {
    // Find the item at the specified index.
    // In this case "data" is an Array that was passed to List as "itemData".
    const item = data[index];
    // Return a value that uniquely identifies this item.
    // Typically this will be a UID of some sort.
    return item.id;
};

// Inside the TeamList component, use the useQuery hook to fetch the user details
export const TeamList: React.FC<TeamListProps> = ({ members }: TeamListProps) => {
    const { userDetails, loading, error } = useBatchRequests(members);
    const styles = useStyles();
    if (loading) return <TableSkeleton />;
    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    const itemCount = userDetails.length;

    return (
        <InfiniteLoader itemCount={itemCount}>
            {({ onItemsRendered, ref }) => (
                <FixedSizeList
                    useIsScrolling={true}
                    height={750}
                    itemSize={150}
                    itemCount={itemCount}
                    itemKey={itemKey}
                    width='100%'
                    overscanCount={5}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    itemData={userDetails}
                    className={styles.insetList}>
                    {({ index, style }) => (
                        renderPersona(userDetails[index], style)
                    )}
                </FixedSizeList>
            )}
        </InfiniteLoader>
    );
};