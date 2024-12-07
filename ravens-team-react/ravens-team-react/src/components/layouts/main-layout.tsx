// src/components/TeamContainer.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Footer } from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { Body1Strong, Spinner, makeStyles, tokens } from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";
import { TeamTabPanel } from '../teams/teams-list/team-tab-panel';
import { HeaderNav } from '../bars/headers/header-nav-component';
import { useQuery } from '../../utils/axios-instance';
import { getBroadcasterInfo } from '../../utils/twitchApi';
import { TwitchBroadcasterResponse } from '../../utils/twitch-api-types/user-types';
import { useTeamInfo } from '../../hooks/team-hooks/use-team-info';
import { TeamResponse } from '../../utils/twitch-api-types/team-types';
import { ContentLayout } from './content-layout';
import { TeamPanels } from '../teams/teams-list/team-panels-view';
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
        marginBottom: tokens.spacingVerticalL,
        zIndex: tokens.zIndexContent
    },
    footerNavBar: {
        width: '100%',
        bottom: 0,
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
    const { teams, loading, error } = useTeamInfo(broadcasterId);
    const [broadcasterInfo, { loading: broadcasterLoading, error: broadcasterError }] = useQuery<TwitchBroadcasterResponse, string>(getBroadcasterInfo, broadcasterId);
    const [selectedValue, setSelectedValue] = useState<TabValue>(teams[0]?.id);
    const styles = useStyles();

    if (loading || broadcasterLoading) return <Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' />;
    if (broadcasterError) return <Body1Strong as="strong" align='center'>Error loading broadcaster information: <code>{broadcasterError}</code></Body1Strong>;
    if (error) return <Body1Strong as="strong" align='center'>Error loading broadcaster information: <code>{error.message}</code></Body1Strong>;

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };
    const team = teams?.find((team) => team?.id === selectedValue) ?? teams[0];
    return (
        <div className={styles.removeOverflow}>
            {/* Header content */}
            <header className={styles.headerProp}>
                <HeaderComponent broadcasterName={broadcasterInfo[0].broadcaster_name ?? ""} />
                <HeaderNav teams={teams} defaultTab={team?.id} onTabChange={onTabSelect} />
            </header>
            {/* Main content */}
            <main className={styles.mainLayout}>
                <TeamPanels currentTeamId={selectedValue as string} teams={teams} />
            </main>
            {/* Footer content */}
            <footer className={styles.footerNavBar}>
                <Footer />
            </footer>
        </div>
    );
};