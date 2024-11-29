// src/components/TeamList.tsx
import React, { memo, useCallback } from 'react';
import { areEqual, FixedSizeList } from "react-window";
import { List, ListItem } from "@fluentui/react-list-preview";
import { TeamListItem } from './team-list-item';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { Body1, makeResetStyles, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { useBatchRequests } from '../../../hooks/batch-request-hooks/use-batch-requests';
import { TableSkeleton } from '../../skeletons/initializer-skeleton';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
interface TeamListProps {
    members: BasicTwitchUser[][];
}
const useListItemRootStyles = makeResetStyles({
    position: "relative",
    flexGrow: "1",
    gap: "0.5em",
    alignItems: "center",
    borderRadius: "8px",
    gridTemplate: `"preview preview preview" auto
        "header action secondary_action" auto / 1fr auto auto
      `,
  });
const useStyles = makeStyles({
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        maxWidth: "300px",
    },
    listItem: {
        display: "grid",
        padding: "8px",
      },
      caption: {
        color: tokens.colorNeutralForeground3,
      },
      image: {
        height: "160px",
        maxWidth: "100%",
        borderRadius: "5px",
      },
      title: {
        color: tokens.colorNeutralForeground1,
        fontWeight: 600,
        display: "block",
      }
});


// Inside the TeamList component, use the useQuery hook to fetch the user details
export const TeamList: React.FC<TeamListProps> = ({ members }: TeamListProps) => {
    const { userDetails, loading, error } = useBatchRequests(members);
    const rootStyles = useListItemRootStyles();
    const styles = useStyles();
    if (loading) return <TableSkeleton />;
    if (error) return <div>Error: <code>{error}</code></div>;


    return (
        <List navigationMode="composite"
            className={mergeClasses(rootStyles,styles.list)}>
            {userDetails.map((member, index) => (
                <ListItem key={member.id}
                value={member.display_name}
                data-value={member.display_name}
                aria-label={member.display_name}
                className={styles.listItem}
                checkmark={null}>
                    <TeamListItem key={index} member={member} />
                </ListItem>
            ))}
        </List>
    );
};