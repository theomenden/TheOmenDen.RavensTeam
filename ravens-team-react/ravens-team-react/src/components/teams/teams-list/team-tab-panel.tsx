// src/components/TeamTabPanel.tsx
import React, { useState } from 'react';
import { Body1Strong, Spinner } from '@fluentui/react-components';
import { TeamList } from './team-list';
import { ContentLayout } from '../../layouts/content-layout';
import { useQuery } from '../../../utils/axios-instance';
import { getChunkedTeamMembers } from '../../../utils/twitchApi';
import { BasicTwitchUser, TeamResponse, TeamMembersResponse } from '../../../utils/twitch-api-types/team-types';

interface TeamTabPanelProps {
    teamId: string | null,
};

function batchReduce<T>({ arr, batchSize }: { arr: T[]; batchSize: number; }): T[][] {
    return arr.reduce((batches, _, i) => {
        if (i % batchSize === 0) batches.push([]);
        batches[batches.length - 1].push(arr[i]);
        return batches;
    }, [] as T[][]);
};

export const TeamTabPanel: React.FC<TeamTabPanelProps> = ({teamId}: TeamTabPanelProps) => {
    console.info('Team Tab Panel - Team ID:', teamId);
    const [teamUsers, { loading, error }] = useQuery<TeamMembersResponse, string>(getChunkedTeamMembers, teamId);

    if (loading) return <Spinner appearance='primary' label={'Loading panel data...'} labelPosition='before' />;
    if (error) return <Body1Strong as="strong" align='center'><code>Error loading members information: {JSON.stringify(error)}</code></Body1Strong>;

    const renderTeamList = () => {
    const batchedResolvedTwitchUsers = batchReduce<BasicTwitchUser>(
        { arr: teamUsers[0].users as BasicTwitchUser[], batchSize: 100 });
        return <TeamList members={batchedResolvedTwitchUsers} />;
    };
    
    return (
        <ContentLayout>
            {renderTeamList()}
        </ContentLayout>
    );
};
