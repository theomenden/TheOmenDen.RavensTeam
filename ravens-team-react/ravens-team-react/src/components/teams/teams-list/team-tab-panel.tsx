// src/components/TeamTabPanel.tsx
import React from 'react';
import { Body1Strong, Divider, Spinner, Subtitle2Stronger, makeStyles, tokens } from '@fluentui/react-components';
import { TeamList } from './team-list';
import { ContentLayout } from '../../layouts/content-layout';
import { useQuery } from '../../../utils/axios-instance';
import { getChunkedTeamMembers } from '../../../utils/twitchApi';
import { BasicTwitchUser, TeamDetails } from '../../../utils/twitch-api-types/team-types';

interface TeamTabPanelProps {
    teamDetailsMap: TeamDetails,
    currentTab?: string,
}

const useStyles = makeStyles({
    dividerSpacing: {
        marginTop: tokens.spacingVerticalS,
        marginBottom: tokens.spacingVerticalS,
    },
    textSpacing: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: '0',
        marginBottom: '0'
    }    
});

export const TeamTabPanel: React.FC<TeamTabPanelProps> = ({ teamDetailsMap, currentTab }: TeamTabPanelProps) => {
    if (!currentTab) {
        currentTab = Object.keys(teamDetailsMap).map(team => team)[0];
    }
    const teamId: string = teamDetailsMap[currentTab!].id;

    const [teamUsers, { loading, error }] = useQuery(getChunkedTeamMembers, teamId);

    const members = teamUsers?.data.reduce((acc: any[], user: { users: any; }) => {
        acc.push(...user.users);
        return acc;
    }, [] as BasicTwitchUser[]);

    const styles = useStyles();

    if (loading) return <div><Spinner appearance='primary' label={'Loading panel data...'} labelPosition='before' /></div>;
    if (error) return <div><Body1Strong align='center'>Error loading members information: {JSON.stringify(error)}</Body1Strong></div>;

    return (
        <ContentLayout>
                <TeamList members={members!} />
        </ContentLayout>
    )
};
