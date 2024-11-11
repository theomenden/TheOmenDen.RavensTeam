// src/components/TeamList.tsx
import React, { memo } from 'react';
import { areEqual, FixedSizeList } from 'react-window';
import { TeamListItem } from './team-list-item';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { BasicTwitchUser } from '../../../utils/twitch-api-types/team-types';
import { Spinner, makeStyles, tokens } from '@fluentui/react-components';
import { useBatchRequests } from '../../../hooks/batch-request-hooks/use-batch-requests';
interface TeamListProps {
    members: BasicTwitchUser[];
}

const renderPersona = (member: TwitchUser, style: React.CSSProperties) => {
    return (<TeamListItem key={member.id} member={member} listStyles={style} />);
};

const useStyles = makeStyles({
    insetList: {
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0
    }
});

function itemKey(index: number, data: TwitchUser[]): string {
    // Find the item at the specified index.
    // In this case "data" is an Array that was passed to List as "itemData".
    const item = data[index];
    // Return a value that uniquely identifies this item.
    // Typically this will be a UID of some sort.
    return item.id;
}
export const TeamList: React.FC<TeamListProps> = ({ members }) => {
    const { userDetails, loading, error } = useBatchRequests(members);
    const styles = useStyles();
    if (loading) return <div><Spinner appearance='primary' label={'Loading list data...'} labelPosition='before' /></div>;
    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    const itemCount = userDetails.length;

    return (
        <div className={styles.insetList}>
            <FixedSizeList
                useIsScrolling={true}
                height={750}
                itemSize={150}
                itemCount={itemCount}
                itemKey={itemKey}
                width='100%'
                overscanCount={5}
                itemData={userDetails}>
                {({ index, style }) => (
                    renderPersona(userDetails[index], style)
                )}
            </FixedSizeList>
        </div>
    );
};