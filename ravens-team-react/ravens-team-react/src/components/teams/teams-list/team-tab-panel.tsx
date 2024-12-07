// src/components/TeamTabPanel.tsx
import React, { useState } from 'react';
import { Body1Strong, Caption1, Spinner } from '@fluentui/react-components';
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

export const TeamTabPanel: React.FC<TeamTabPanelProps> = ({ teamId }: TeamTabPanelProps) => {
    const [teamUsers, { loading, error }] = useQuery<TeamMembersResponse, string>(getChunkedTeamMembers, teamId);
    
    if (loading) return <Spinner appearance='primary' label={'Loading panel data...'} labelPosition='before' />;
    if (error) return <div><Body1Strong as="strong" align='center'>Error loading members information:</Body1Strong><Caption1 as="p"><code>{JSON.stringify(error)}</code></Caption1></div>;
    const batchedResolvedTwitchUsers = batchReduce<BasicTwitchUser>({ arr: teamUsers[0].users as BasicTwitchUser[], batchSize: 100 });
    return <TeamList members={batchedResolvedTwitchUsers} />;
};
