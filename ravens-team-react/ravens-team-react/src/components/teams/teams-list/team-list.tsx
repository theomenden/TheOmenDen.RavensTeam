// src/components/TeamList.tsx
import React from 'react';
import { FixedSizeList } from 'react-window';
import { TeamListItem } from './team-list-item';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import AutoSizer from 'react-virtualized-auto-sizer';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { Spinner } from '@fluentui/react-components';
import { useBatchRequests } from '../../../hooks/batch-request-hooks/use-batch-requests';
interface TeamListProps {
    members: BasicTwitchUser[];
}
const renderPersona = (index: number, style: React.CSSProperties, member: TwitchUser) => {
    return <TeamListItem key={member.id} member={member} />;
};
function itemKey(index: number, data: TwitchUser[]): string {
    // Find the item at the specified index.
    // In this case "data" is an Array that was passed to List as "itemData".
    const item = data[index];
    console.log('itemKey:', item);
    // Return a value that uniquely identifies this item.
    // Typically this will be a UID of some sort.
    return item.id;
}
export const TeamList: React.FC<TeamListProps> = ({ members }) => {
    const { userDetails, loading, error } = useBatchRequests(members);
    if (loading) return <div><Spinner appearance='primary' label={'Loading list data...'} labelPosition='before' /></div>;
    if (error) return <div>Error: {JSON.stringify(error)}</div>;
    return (
        <FixedSizeList
            height={750}
            itemSize={150}
            itemCount={userDetails.length}
            itemKey={itemKey}
            width='100%'
            itemData={userDetails}>
            {({ index, style }) => (
                renderPersona(index, style, userDetails[index])
            )}
        </FixedSizeList>
    );
};