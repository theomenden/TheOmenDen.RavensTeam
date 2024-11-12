// src/components/TeamTabPanel.tsx
import React from 'react';
import { Body1Strong, Spinner } from '@fluentui/react-components';
import { TeamList } from './team-list';
import { ContentLayout } from '../../layouts/content-layout';
import { useQuery } from '../../../utils/axios-instance';
import { getChunkedTeamMembers } from '../../../utils/twitchApi';
import { BasicTwitchUser, TeamDetails } from '../../../utils/twitch-api-types/team-types';

interface TeamTabPanelProps {
    teamDetailsMap: TeamDetails,
    currentTab?: string,
}

function batchReduce<T>(arr: T[], batchSize: number): T[][] {
    return arr.reduce((batches, _, i) => {
        if (i % batchSize === 0) batches.push([]);
        batches[batches.length - 1].push(arr[i]);
        return batches;
    }, [] as T[][]);
}


export const TeamTabPanel: React.FC<TeamTabPanelProps> = ({ teamDetailsMap, currentTab }: TeamTabPanelProps) => {
    if (!currentTab) {
        currentTab = Object.keys(teamDetailsMap).map(team => team)[0];
    }
    const teamId: string = teamDetailsMap[currentTab!].id;

    const [teamUsers, { loading, error }] = useQuery(getChunkedTeamMembers, teamId);

    if (loading) return <div><Spinner appearance='primary' label={'Loading panel data...'} labelPosition='before' /></div>;
    if (error) return <div><Body1Strong align='center'>Error loading members information: {JSON.stringify(error)}</Body1Strong></div>;

    return (
        <ContentLayout>
                <TeamList members={batchReduce(teamUsers?.data.reduce((acc: any[], user: { users: any; }) => {
        acc.push(...user.users);
        return acc;
    }, [] as BasicTwitchUser[]), 100) as BasicTwitchUser[][]} />
        </ContentLayout>
    )
};
