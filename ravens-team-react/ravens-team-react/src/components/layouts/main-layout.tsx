// src/components/TeamContainer.tsx
import React, { Children } from 'react';
import '../../styles/TeamContainer.scss';
import Footer from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { Body1Strong, Spinner, Text, Title1 } from '@fluentui/react-components';
import { TeamTabPanel } from '../teams/teams-list/team-tab-panel';
import { HeaderNav } from '../bars/headers/header-nav-component';
import { useQuery } from '../../utils/axios-instance';
import { getBroadcasterInfo, getTeamsForBroadcaster } from '../../utils/twitchApi';
import { TeamDetails, TeamMembersByTeam } from '../../utils/twitch-api-types/team-types';
import { useTeamData } from '../../hooks/team-hooks/use-team-data';
interface MainLayoutProps {
    broadcasterId: string;
    helixAuthToken: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ broadcasterId, helixAuthToken }, { children }: { children: React.ReactNode }) => {
    const [broadcasterInfo, { loading, error }] = useQuery(getBroadcasterInfo, broadcasterId); // useBroadcasterInfo({ broadcasterId: broadcasterId, accessToken: helixAuthToken });
    const [teamDetails, { loading: dataLoading, error: dataError }] = useQuery(getTeamsForBroadcaster, broadcasterId);
    const [selectedTab, setSelectedTab] = React.useState<string | null>(teamDetails?.data[0].team_display_name ?? null);
    if (loading) return <div><Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' /></div>;
    if (error) return <div><Body1Strong align='center'>Error loading broadcaster information: [error]</Body1Strong></div>;

    if (dataLoading) return <div><Spinner appearance='primary' label={'Loading team data...'} labelPosition='before' /></div>;
    if (dataError) return <div><Body1Strong align='center'>Error loading team data: [dataError]</Body1Strong></div>;

    const teamInfo: TeamDetails = teamDetails!.data.reduce((acc, team) => {
        acc[team.team_display_name] = {
            id: team.id,
            logoUrl: team.thumbnail_url,
            info: team.info
        };
        return acc;
    }, {} as TeamDetails);

    return (
        <div>
            {/* Header with navigation and broadcaster name */}
            <HeaderComponent broadcasterName={broadcasterInfo?.data[0].broadcaster_name ?? ""} />
            <HeaderNav teams={teamInfo} selectedTab={selectedTab} onTabSelect={setSelectedTab} />

            {/* Main content area */}
            <main>
                <TeamTabPanel teamDetailsMap={teamInfo} currentTab={selectedTab || ''}/>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;
