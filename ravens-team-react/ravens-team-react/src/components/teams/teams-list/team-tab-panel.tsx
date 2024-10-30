// src/components/TeamTabPanel.tsx
import React from 'react';
import { Text } from '@fluentui/react-components';
import TeamList from './team-list';
import { TwitchUser } from '../../../utils/twitch-api-types/user-types';
import { ContentLayout } from '../../layouts/content-layout';

interface TeamTabPanelProps {
    teamName: string;
    members: TwitchUser[];
}

export const TeamTabPanel: React.FC<TeamTabPanelProps> = ({ teamName, members }) => (
    <ContentLayout>
        <div className="team-tab-panel">
            <Text as="h5" weight="semibold">{teamName}</Text>
            <TeamList members={members} />
        </div>
    </ContentLayout>
);
