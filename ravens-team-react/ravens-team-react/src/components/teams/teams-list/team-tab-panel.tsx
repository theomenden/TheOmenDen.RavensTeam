// src/components/TeamTabPanel.tsx
import React from 'react';
import { Body1Strong, Divider, Spinner, Subtitle2Stronger, Text } from '@fluentui/react-components';
import { TeamList } from './team-list';
import { ContentLayout } from '../../layouts/content-layout';
import { useQuery } from '../../../utils/axios-instance';
import { getChunkedTeamMembers, getChunkedUsersDetails } from '../../../utils/twitchApi';
import { BasicTwitchUser, TeamDetails } from '../../../utils/twitch-api-types/team-types';

interface TeamTabPanelProps {
    teamDetailsMap: TeamDetails,
    currentTab?: string,
}

export const TeamTabPanel: React.FC<TeamTabPanelProps> = ({ teamDetailsMap, currentTab }: TeamTabPanelProps) => {
    if (!currentTab) {
        currentTab = Object.keys(teamDetailsMap).map(team => team)[0];
    }
    const teamId = teamDetailsMap[currentTab!].id;

    const [teamUsers, { loading, error }] = useQuery(getChunkedTeamMembers, teamId);

    const members = teamUsers?.data.reduce((acc, user) => {
        acc.push(...user.users);
        return acc;
    }, [] as BasicTwitchUser[]);


    if (loading) return <div><Spinner appearance='primary' label={'Loading panel data...'} labelPosition='before' /></div>;
    if (error) return <div><Body1Strong align='center'>Error loading members information: {JSON.stringify(error)}</Body1Strong></div>;

    return (
        <ContentLayout>
                <Subtitle2Stronger as="h5" align='center' >{currentTab}</Subtitle2Stronger>
                <Divider appearance='brand' />
                <TeamList members={members!} />
        </ContentLayout>
    )
};
