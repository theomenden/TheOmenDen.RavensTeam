// src/components/TeamList.tsx
import React from 'react';
import { FixedSizeList as VirtualizedList, ListChildComponentProps } from 'react-window';
import { TeamListItem } from './team-list-item';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import AutoSizer from 'react-virtualized-auto-sizer';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { useQuery } from '../../../utils/axios-instance';
import { getChunkedUsersDetails, getUserDetails } from '../../../utils/twitchApi';
import { Spinner } from '@fluentui/react-components';
import { CacheAxiosResponse } from 'axios-cache-interceptor';
interface TeamListProps {
    members: BasicTwitchUser[];
}
const renderPersona = ({ index, style }: ListChildComponentProps, member: TwitchUser) => {

    console.log('Rendering persona', index, member);
    return <TeamListItem key={member.id} member={member} />;
};

export const TeamList: React.FC<TeamListProps> = ({ members }) => {
    const BATCH_SIZE = 100;
    const teamMemberDetails: TwitchUser[] = [];
    let infoLoading = true;
    let errorLoading = {};
    for(let i = 0; i < members.length; i+= BATCH_SIZE){
        // Fetch user details in batches of 100

        
    const batch = members.slice(i, i + BATCH_SIZE).map(member => member.user_login);
    const [membersDetails, {loading: infoLoading, error: errorLoading}] = useQuery(getChunkedUsersDetails, batch);
    teamMemberDetails.push(...membersDetails!.data);
    }

    if(infoLoading) return <div><Spinner appearance='primary' label={'Loading member data...'} labelPosition='before' /></div>;
    if(errorLoading) return <div>Error: {JSON.stringify(errorLoading)}</div>;

    return (
        <AutoSizer>
            {({ height, width }) => (
                <VirtualizedList
                    height={height}
                    itemCount={teamMemberDetails.length}
                    itemSize={35}
                    width={width}
                    itemData={teamMemberDetails}>
                    {renderPersona}
                </VirtualizedList>
            )}
        </AutoSizer>
    );
};