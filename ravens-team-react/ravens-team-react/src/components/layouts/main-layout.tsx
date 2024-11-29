// src/components/TeamContainer.tsx
import React, { useState } from 'react';
import { Footer } from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { Body1Strong, Spinner, makeStyles, tokens } from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent,TabValue} from "@fluentui/react-components";
import { TeamTabPanel } from '../teams/teams-list/team-tab-panel';
import { HeaderNav } from '../bars/headers/header-nav-component';
import { useQuery } from '../../utils/axios-instance';
import { getBroadcasterInfo } from '../../utils/twitchApi';
import { TwitchBroadcasterResponse } from '../../utils/twitch-api-types/user-types';
import { useTeamInfo } from '../../hooks/team-hooks/use-team-info';
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
    const [broadcasterInfo, {loading: broadcasterLoading, error: broadcasterError}] = useQuery<TwitchBroadcasterResponse, string>(getBroadcasterInfo, broadcasterId); 
    const {teams,  loading, error } = useTeamInfo(broadcasterId);
    const [selectedValue, setSelectedValue] = useState<TabValue>(teams[0]?.id ?? "");
    
    if (loading || broadcasterLoading) return <Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' />;
    if (broadcasterError) return <Body1Strong as="strong" align='center'>Error loading broadcaster information: [broadcasterError]</Body1Strong>;
    if (error) return <Body1Strong as="strong" align='center'>Error loading broadcaster information: <code>[error]</code></Body1Strong>;

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

    const renderHeader = () => {
        return (
            <header className={styles.headerProp}>
                <HeaderComponent broadcasterName={broadcasterInfo[0].broadcaster_name ?? ""} />
                <HeaderNav teams={teams} defaultTab={teams[0]?.id} onTabChange={onTabSelect}/>
            </header>
        );
    };

    const renderMainContent = () => {
        return (
            <main className={styles.mainLayout}>
                {
                    teams.map(team => {
                        return(
                            <div role="tabpanel" aria-labelledby={team.id}>
                                <TeamTabPanel teamId={team.id} />
                            </div>
                        );
                    })
                }
            </main>
        );
    };
    const renderFooter = () => {
        return (
            <footer className={styles.footerNavBar}>
                <Footer />
            </footer>
        );
    };
    return (
        <div className={styles.removeOverflow}>
            {
            /* Header with navigation and broadcaster name */
            renderHeader()
            }
            {
            /* Main content area */
            renderMainContent()
            }
            {
            /* Footer */
            renderFooter()
            }
        </div>
    );
};