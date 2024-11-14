// src/components/TeamContainer.tsx
import React from 'react';
import { Footer } from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { Body1Strong, Spinner, makeStyles, tokens } from '@fluentui/react-components';
import { TeamTabPanel } from '../teams/teams-list/team-tab-panel';
import { HeaderNav } from '../bars/headers/header-nav-component';
import { useQuery } from '../../utils/axios-instance';
import { getBroadcasterInfo, getTeamsForBroadcaster } from '../../utils/twitchApi';
import { TeamDetails } from '../../utils/twitch-api-types/team-types';
import { useTeamData } from '../../hooks/team-hooks/use-team-data';
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
        display: 'grid',
        gridAutoFlow: 'row dense',
        paddingTop: tokens.spacingVerticalM,
        paddingBottom: tokens.spacingVerticalL,
        marginTop: tokens.spacingVerticalL,
        marginRight: tokens.spacingHorizontalXL,
        zIndex: tokens.zIndexBackground
    },
    footerNavBar: {
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForeground1,
        justifyContent: "space-between",
        textAlign: "center",
        position: "sticky",
        bottom: 0,
        paddingTop: tokens.spacingVerticalSNudge,
        paddingBottom: tokens.spacingVerticalSNudge,
        zIndex: 100,
        boxShadow: tokens.shadow8Brand
    },
    removeOverflow: {
        overflowY: 'hidden'
    },
});


export const MainLayout: React.FC<MainLayoutProps> = ({ broadcasterId }) => {
    const styles = useStyles();
    const [broadcasterInfo, { loading, error }] = useQuery(getBroadcasterInfo, broadcasterId); // useBroadcasterInfo({ broadcasterId: broadcasterId, accessToken: helixAuthToken });
    const {teams,  loading: dataLoading, error: dataError } = useTeamData(broadcasterId); // useTeamsForBroadcaster({ broadcasterId: broadcasterId, accessToken: helixAuthToken });
    const [selectedTab, setSelectedTab] = React.useState<string | null>(teams?.data[0].team_display_name ?? null);
    if (loading) return <div><Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' /></div>;
    if (error) return <div><Body1Strong align='center'>Error loading broadcaster information: [error]</Body1Strong></div>;

    if (dataLoading) return <div><Spinner appearance='primary' label={'Loading team data...'} labelPosition='before' /></div>;
    if (dataError) return <div><Body1Strong align='center'>Error loading team data: [dataError]</Body1Strong></div>;
   

    // if teamInfo is not empty and selectedTab is null or empty, default to first team
    if (Object.keys(teams).length > 0 && selectedTab === null) {
        setSelectedTab(Object.keys(teams)[0]);
    }


    return (
        <div className={styles.removeOverflow}>
            {/* Header with navigation and broadcaster name */}
            <header className={styles.headerProp}>
                <HeaderComponent broadcasterName={broadcasterInfo?.data[0].broadcaster_name ?? ""} />
                <HeaderNav teams={teams} selectedTab={selectedTab} onTabSelect={setSelectedTab} />
            </header>
            {/* Main content area */}
            <main className={styles.mainLayout}>
                <TeamTabPanel teamDetailsMap={teams} currentTab={selectedTab || ''} />
            </main>
            {/* Footer */}
            <footer className={styles.footerNavBar}>
            <Footer />
            </footer>
        </div>
    );
};