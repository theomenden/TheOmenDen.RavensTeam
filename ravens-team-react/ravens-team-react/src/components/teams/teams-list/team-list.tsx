// src/components/TeamList.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { areEqual, FixedSizeList } from "react-window";
import { List, ListItem } from "@fluentui/react-list-preview";
import { TeamListItem } from './team-list-item';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { Body1, Caption1, makeResetStyles, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { useBatchRequests } from '../../../hooks/batch-request-hooks/use-batch-requests';
import { TableSkeleton } from '../../skeletons/initializer-skeleton';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { BroadcasterType, UserFilters } from '../../../utils/search-types/broadcaster-types';
interface TeamListProps {
    usernameToFilter?: string;
    teamLevelFilters?: UserFilters;
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
        width: "100%",
        maxHeight: "500px",
        overflowX: "hidden",
        overflowY: "scroll"
    },
    listItem: {
        display: "grid",
        width: "100%",
        height: "100%",
        marginRight: tokens.spacingHorizontalXL,

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
export const TeamList: React.FC<TeamListProps> = ({ members, usernameToFilter, teamLevelFilters }: TeamListProps) => {
    const { userDetails, loading, error } = useBatchRequests(members);
    const filteredUserDetails = React.useMemo(() =>{
        if (!usernameToFilter && !teamLevelFilters) {
            return userDetails;
        }
        let filteredUserDetails: TwitchUser[] = [];

        if(teamLevelFilters) {
            const broadcasterTypeFilter = teamLevelFilters.broadcasterTypes.length > 0? teamLevelFilters.broadcasterTypes : [];
            const userTypeFilter = teamLevelFilters.userTypes.length > 0? teamLevelFilters.userTypes : [];
            if(broadcasterTypeFilter.length > 0) {
                // if the broadcaster type is ONLY regular, filter out the affiliates and partners
                if(broadcasterTypeFilter.includes('affiliate')) {
                    filteredUserDetails.push(...userDetails.filter(user => user.broadcaster_type === 'affiliate'));
                }

                if(broadcasterTypeFilter.includes('partner')) {
                    filteredUserDetails.push(...userDetails.filter(user => user.broadcaster_type === 'partner'));
                }

                if(broadcasterTypeFilter.includes('regular')) {
                    filteredUserDetails.push(...userDetails.filter(user => user.broadcaster_type == ''));
                }
            }

            if(userTypeFilter.length > 0) {
                filteredUserDetails = filteredUserDetails.filter(user => teamLevelFilters.userTypes.includes(user.type));
            }
        }

        if(usernameToFilter && usernameToFilter.trim() !== '') //Ignore empty string filter
        {
          filteredUserDetails =filteredUserDetails.filter(user => user.display_name.toLowerCase().includes(usernameToFilter.toLowerCase()));
        }
        return filteredUserDetails;
    }, [userDetails, usernameToFilter, teamLevelFilters]);
    const rootStyles = useListItemRootStyles();
    const styles = useStyles();

    if (loading) return <TableSkeleton />;
    if (error) return <div><Body1 as="h2">Error: </Body1><Caption1 as="p"><code>{error}</code></Caption1></div>;

    return (
        <List navigationMode="composite"
            className={mergeClasses(rootStyles, styles.list)}>
            {filteredUserDetails.map((member) => (
                <ListItem key={member.id}
                    value={member.display_name}
                    data-value={member.display_name}
                    aria-label={member.display_name}
                    className={styles.listItem}
                    checkmark={null}>
                    <div role="gridcell" className={styles.listItem}>
                        <TeamListItem member={member} />
                    </div>
                </ListItem>
            ))}
        </List>
    );
};