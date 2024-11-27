// src/components/TeamList.tsx
import React from 'react';
import { List, ListItem } from "@fluentui/react-list-preview";
import { TeamListItem } from './team-list-item';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { makeStyles } from '@fluentui/react-components';
import { useBatchRequests } from '../../../hooks/batch-request-hooks/use-batch-requests';
import { TableSkeleton } from '../../skeletons/initializer-skeleton';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
interface TeamListProps {
    members: BasicTwitchUser[][];
}

const useStyles = makeStyles({
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        maxWidth: "300px",
    }
});

// Inside the TeamList component, use the useQuery hook to fetch the user details
export const TeamList: React.FC<TeamListProps> = ({ members }: TeamListProps) => {
    const { userDetails, loading, error } = useBatchRequests(members);
    const styles = useStyles();
    if (loading) return <TableSkeleton />;
    if (error) return <div>Error: {error}</div>;
    return (
        <List className={styles.list}>
            {userDetails.map((user: TwitchUser) => (
                <TeamListItem member={user} />
            ))}
        </List>
    );
};