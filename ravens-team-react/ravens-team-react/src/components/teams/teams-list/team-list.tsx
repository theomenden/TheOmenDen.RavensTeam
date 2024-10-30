// src/components/TeamList.tsx
import React from 'react';
import { FixedSizeList as VirtualizedList, ListChildComponentProps } from 'react-window';
import TeamListItem from './team-list-item';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';

interface TeamListProps {
    members: TwitchUser[];
}

const TeamList: React.FC<TeamListProps> = ({ members }) => {
    const renderPersona = ({ index, style }: ListChildComponentProps) => {
        const member = members[index];
        return <TeamListItem member={member} style={style} />;
    };

    return (
            <VirtualizedList
                height={400}
                itemCount={members.length}
                itemSize={60}
                width="100%"
            >
                {renderPersona}
            </VirtualizedList>
    );
};

export default React.memo(TeamList);
