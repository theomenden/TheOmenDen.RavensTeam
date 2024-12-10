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
    const filteredUserDetails = React.useMemo<TwitchUser[]>(
        () => checkForAnyFilters(teamLevelFilters) ? resolveFiltersForUsers(teamLevelFilters, userDetails, usernameToFilter) : userDetails,
        [userDetails, usernameToFilter, teamLevelFilters]
    );
    const rootStyles = useListItemRootStyles();
    const styles = useStyles();

    if (loading) return <TableSkeleton />;
    if (error) return <div><Body1 as="h2">Error: </Body1><Caption1 as="p"><code>{error.message}</code></Caption1></div>;

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
function checkForAnyFilters(filters?: UserFilters): boolean {return filters?.broadcasterTypes.length !== 0 || filters?.userTypes.length !== 0};
function resolveFiltersForUsers(teamLevelFilters: UserFilters | undefined, userDetails: TwitchUser[], usernameToFilter: string | undefined) {
    let filteredUserDetails: TwitchUser[] = [];

    if (teamLevelFilters) {
        const broadcasterTypeFilter = teamLevelFilters.broadcasterTypes.length > 0 ? teamLevelFilters.broadcasterTypes : [];
        const userTypeFilter = teamLevelFilters.userTypes.length > 0 ? teamLevelFilters.userTypes : [];
        checkForBroadcasterTypes(broadcasterTypeFilter, filteredUserDetails, userDetails);

        checkForUserTypes(userTypeFilter, filteredUserDetails, userDetails);
    }

    if (usernameToFilter && usernameToFilter.trim() !== '') //Ignore empty string filter
    {
        filteredUserDetails = filteredUserDetails.filter(user => user.display_name.toLowerCase().includes(usernameToFilter.toLowerCase()));
    }
    return filteredUserDetails;
}

function checkForUserTypes(userTypeFilter: string[], filteredUserDetails: TwitchUser[], userDetails: TwitchUser[]) {
    if (userTypeFilter.length > 0) {
        if (userTypeFilter.includes('staff')) {
            filteredUserDetails.push(...userDetails.filter(user => user.type === 'staff'));
        }

        if (userTypeFilter.includes('admin')) {
            filteredUserDetails.push(...userDetails.filter(user => user.type === 'admin'));
        }

        if (userTypeFilter.includes('global_mod')) {
            filteredUserDetails.push(...userDetails.filter(user => user.type === 'global_mod'));
        }

        if (userTypeFilter.includes('mod')) {
            filteredUserDetails.push(...userDetails.filter(user => user.type === 'mod'));
        }

        if (userTypeFilter.includes('normal')) {
            filteredUserDetails.push(...userDetails.filter(user => user.type === ''));
        }
    }
}

function checkForBroadcasterTypes(broadcasterTypeFilter: string[], filteredUserDetails: TwitchUser[], userDetails: TwitchUser[]) {
    if (broadcasterTypeFilter.length > 0) {
        // if the broadcaster type is ONLY regular, filter out the affiliates and partners
        if (broadcasterTypeFilter.includes('affiliate')) {
            filteredUserDetails.push(...userDetails.filter(user => user.broadcaster_type === 'affiliate'));
        }

        if (broadcasterTypeFilter.includes('partner')) {
            filteredUserDetails.push(...userDetails.filter(user => user.broadcaster_type === 'partner'));
        }

        if (broadcasterTypeFilter.includes('regular')) {
            filteredUserDetails.push(...userDetails.filter(user => user.broadcaster_type == ''));
        }
    }
}
