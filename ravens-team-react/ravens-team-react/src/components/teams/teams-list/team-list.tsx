// src/components/TeamList.tsx
import React from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { List, ListItem } from "@fluentui/react-list-preview";
import { TeamListItem } from './team-list-item';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { useBatchRequests } from '../../../hooks/batch-request-hooks/use-batch-requests';
import { TableSkeleton } from '../../skeletons/initializer-skeleton';
interface TeamListProps {
    members: BasicTwitchUser[][];
}

const TeamMembersList = React.forwardRef<HTMLUListElement>(
    (props: React.ComponentProps<typeof List>, ref) => (
        <List navigationMode="composite" aria-label="Team members" {...props} ref={ref} />
    )
);

const useStyles = makeStyles({
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "300px",
    },
    listItem: {
        display: "grid",
        width: "100%",
        padding: "8px",
    },
});

// Inside the TeamList component, use the useQuery hook to fetch the user details
export const TeamList: React.FC<TeamListProps> = ({ members }: TeamListProps) => {
    const { userDetails, loading, error } = useBatchRequests(members);
    const styles = useStyles();
    if (loading) return <TableSkeleton />;
    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <FixedSizeList
            height={350}
            overscanCount={5}
            itemSize={250}
            itemCount={userDetails.length}
            width={'100%'}
            itemData={userDetails}
            outerElementType={TeamMembersList}
            className={styles.list}>
            {({ index, style, data }) => (
                <ListItem
                    style={style}
                    aria-setsize={userDetails.length}
                    aria-posinset={index + 1}
                    aria-label={data[index].display_name}
                    data-value={data[index]}
                    checkmark={null}>
                    <TeamListItem member={data[index]} />
                </ListItem>
            )}
        </FixedSizeList>
    );
};