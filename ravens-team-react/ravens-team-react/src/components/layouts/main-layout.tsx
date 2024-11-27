// src/components/TeamContainer.tsx
import React from 'react';
import { Footer } from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { Body1Strong, Spinner, makeStyles, tokens } from '@fluentui/react-components';
import { TeamTabPanel } from '../teams/teams-list/team-tab-panel';
import { HeaderNav } from '../bars/headers/header-nav-component';
import { useQuery } from '../../utils/axios-instance';
import { getBroadcasterInfo } from '../../utils/twitchApi';
import { useTeamData } from '../../hooks/team-hooks/use-team-data';
interface MainLayoutProps {
    broadcasterId: string;
}

const useStyles = makeStyles({
    headerProp: {
        top: 0,
        position: 'sticky',
        width: '100%',
        zIndex: tokens.zIndexPriority
    },
    mainLayout: {
        display: 'grid',
        gridAutoFlow: 'row dense',
        gap: '1em',
        justifyContent: 'center',
        width: '100%',
        marginTop: tokens.spacingVerticalL,
        zIndex: tokens.zIndexContent
    },
    footerNavBar: {
        width: '100%',
        bottom:0,
        paddingTop: tokens.spacingVerticalL,
        color: tokens.colorNeutralForeground1,
        justifyContent: "space-evenly",
        textAlign: "center",
        position: "sticky",
        zIndex: tokens.zIndexPriority,
    },
    removeOverflow: {
        overflowY: 'hidden'
    },
});


export const MainLayout: React.FC<MainLayoutProps> = ({ broadcasterId }) => {
    const styles = useStyles();
    const [broadcasterInfo, { loading, error }] = useQuery(getBroadcasterInfo, broadcasterId); 
    const {teams,  loading: dataLoading, error: dataError } = useTeamData(broadcasterId);
    const [selectedTab, setSelectedTab] = React.useState<string | null>(null);
    if (loading) return <Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' />;
    if (error) return <Body1Strong as="strong" align='center'>Error loading broadcaster information: [error]</Body1Strong>;

    if (dataLoading) return <Spinner appearance='primary' label={'Loading team data...'} labelPosition='before' />;
    if (dataError) return <Body1Strong align='center' as="strong">Error loading team data: [dataError]</Body1Strong>;
   
    // if teamInfo is not empty and selectedTab is null or empty, default to first team
    if (teams && Object.keys(teams).length > 0 && selectedTab === null) {
        setSelectedTab(Object.keys(teams)[0]);
    }


    return (
        <div className={styles.removeOverflow}>
            {/* Header with navigation and broadcaster name */}
            <header className={styles.headerProp}>
                <HeaderComponent broadcasterName={broadcasterInfo[0].broadcaster_name ?? ""} />
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