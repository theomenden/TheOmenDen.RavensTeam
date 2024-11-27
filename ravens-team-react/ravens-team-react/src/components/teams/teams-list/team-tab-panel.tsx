// src/components/TeamTabPanel.tsx
import React from 'react';
import { Body1Strong, Spinner } from '@fluentui/react-components';
import { TeamList } from './team-list';
import { ContentLayout } from '../../layouts/content-layout';
import { useMutation, useQuery } from '../../../utils/axios-instance';
import { getChunkedTeamMembers } from '../../../utils/twitchApi';
import { BasicTwitchUser, TeamDetails, TeamMembersResponse } from '../../../utils/twitch-api-types/team-types';

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

function getCurrentTeamIdToDisplay(teamDetailsMap: TeamDetails, currentTab: string | undefined): string {
    if(currentTab && teamDetailsMap[currentTab]) {
        return teamDetailsMap[currentTab].id;
    }
    return teamDetailsMap[Object.keys(teamDetailsMap).map(team => team)[0]].id;
}

export const TeamTabPanel: React.FC<TeamTabPanelProps> = ({ teamDetailsMap, currentTab }: TeamTabPanelProps) => {
    const [teamId] = React.useState(getCurrentTeamIdToDisplay(teamDetailsMap, currentTab));
    const [teamUsers, { loading, error }] = useQuery<TeamMembersResponse, string>(getChunkedTeamMembers, teamId);


    if (loading) return <Spinner appearance='primary' label={'Loading panel data...'} labelPosition='before' />;
    if (error) return <Body1Strong as="strong" align='center'>Error loading members information: {JSON.stringify(error)}</Body1Strong>;
    const batchedResolvedTwitchUsers = batchReduce<BasicTwitchUser>(
        teamUsers[0].users as BasicTwitchUser[], 100);
    return (
        <ContentLayout>
                <TeamList members={batchedResolvedTwitchUsers} />
        </ContentLayout>
    );
};
