// src/components/TeamContainer.tsx
import React, { Children } from 'react';
import '../../styles/TeamContainer.scss';
import Footer from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { useBroadcasterInfo } from '../../hooks/broadcaster-hooks/use-broadcaster-data';
import { useTeamData } from '../../hooks/team-hooks/use-team-data';
import { Body1Strong, Spinner, Text, Title1 } from '@fluentui/react-components';
import { TeamTabPanel } from '../teams/teams-list/team-tab-panel';
import { HeaderNav } from '../bars/headers/header-nav-component';
interface MainLayoutProps {
    broadcasterId: string;
    helixAuthToken: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ broadcasterId, helixAuthToken},  {children}: {children: React.ReactNode} ) => {
    const { broadcasterInfo, loading: infoLoading, error: infoError } = useBroadcasterInfo({ broadcasterId: broadcasterId, accessToken: helixAuthToken });
    const { teamMembersByTeam, teamDetails, loading: dataLoading, error: dataError } = useTeamData({ broadcasterId, accessToken: helixAuthToken });
    const [selectedTab, setSelectedTab] = React.useState<string | null>(Object.keys(teamDetails)[0] || null);

    if (infoLoading) return <div><Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' /></div>;
    if (infoError) return <div><Body1Strong align='center'>Error loading broadcaster information: {infoError}</Body1Strong></div>;

    if (dataLoading) return <div><Spinner appearance='primary' label={'Loading team data...'} labelPosition='before' /></div>;
    if (dataError) return <div><Body1Strong align='center'>Error loading team data: {dataError}</Body1Strong></div>;
    return (
        <div className="main-layout">
            {/* Header with navigation and broadcaster name */}
            <HeaderComponent
                broadcasterName={broadcasterInfo?.broadcaster_name || 'Broadcaster'}
                teams={teamDetails} />
            <HeaderNav 
            broadcasterName={broadcasterInfo?.broadcaster_name || ''}
            teams={teamDetails}
            selectedTab={selectedTab}
            onTabSelect={setSelectedTab} />
            {/* Main content area */}
            <main className="main-layout__main">
                <TeamTabPanel teamName={selectedTab || ''} members={teamMembersByTeam[selectedTab || '']} />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;
