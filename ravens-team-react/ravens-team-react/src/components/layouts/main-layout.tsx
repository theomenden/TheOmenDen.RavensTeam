// src/components/TeamContainer.tsx
import React from 'react';
import '../../styles/TeamContainer.scss';
import { Footer } from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { Body1Strong, Spinner, makeStyles, tokens } from '@fluentui/react-components';
import { TeamTabPanel } from '../teams/teams-list/team-tab-panel';
import { HeaderNav } from '../bars/headers/header-nav-component';
import { useQuery } from '../../utils/axios-instance';
import { getBroadcasterInfo, getTeamsForBroadcaster } from '../../utils/twitchApi';
import { TeamDetails } from '../../utils/twitch-api-types/team-types';
interface MainLayoutProps {
    broadcasterId: string;
}

const useStyles = makeStyles({
    headerProp: {
        top: 0,
        position: 'sticky',
        zIndex: tokens.zIndexPriority,
    },
    mainLayout: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: tokens.spacingVerticalM,
        paddingBottom: tokens.spacingVerticalL,
        marginTop: tokens.spacingVerticalL,
        marginRight: tokens.spacingHorizontalXL,
        zIndex: tokens.zIndexBackground
    },
    removeOverflow: {
        overflow: 'hidden',
    },
});


export const MainLayout: React.FC<MainLayoutProps> = ({ broadcasterId }) => {
    const styles = useStyles();
    const [broadcasterInfo, { loading, error }] = useQuery(getBroadcasterInfo, broadcasterId); // useBroadcasterInfo({ broadcasterId: broadcasterId, accessToken: helixAuthToken });
    const [teamDetails, { loading: dataLoading, error: dataError }] = useQuery(getTeamsForBroadcaster, broadcasterId);
    const [selectedTab, setSelectedTab] = React.useState<string | null>(teamDetails?.data[0].team_display_name ?? null);
    if (loading) return <div><Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' /></div>;
    if (error) return <div><Body1Strong align='center'>Error loading broadcaster information: [error]</Body1Strong></div>;

    if (dataLoading) return <div><Spinner appearance='primary' label={'Loading team data...'} labelPosition='before' /></div>;
    if (dataError) return <div><Body1Strong align='center'>Error loading team data: [dataError]</Body1Strong></div>;
    const teamInfo: TeamDetails = teamDetails!.data.reduce((acc: { [x: string]: { id: any; logoUrl: any; info: any; }; }, team: { team_display_name: string | number; id: any; thumbnail_url: any; info: any; }) => {
        acc[team.team_display_name] = {
            id: team.id,
            logoUrl: team.thumbnail_url,
            info: team.info
        };
        return acc;
    }, {} as TeamDetails);

    return (
        <div className={styles.removeOverflow}>
            {/* Header with navigation and broadcaster name */}
            <header className={styles.headerProp}>
                <HeaderComponent broadcasterName={broadcasterInfo?.data[0].broadcaster_name ?? ""} />
                <HeaderNav teams={teamInfo} selectedTab={selectedTab} onTabSelect={setSelectedTab} />
            </header>
            {/* Main content area */}
            <main className={styles.mainLayout}>
                <TeamTabPanel teamDetailsMap={teamInfo} currentTab={selectedTab || ''} />
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};