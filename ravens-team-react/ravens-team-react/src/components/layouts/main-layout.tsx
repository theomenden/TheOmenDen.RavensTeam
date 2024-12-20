// src/components/TeamContainer.tsx
import React, { useState } from 'react';
import { Footer } from '../bars/footers/footer-nav';
import { HeaderComponent } from '../bars/headers/header-component';
import { Body1Strong, Spinner, makeStyles, tokens } from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent, TabValue } from "@fluentui/react-components";
import { HeaderNav } from '../bars/headers/header-nav-component';
import { useQuery } from '../../utils/axios-instance';
import { getBroadcasterInfo } from '../../utils/twitchApi';
import { TwitchBroadcasterResponse } from '../../utils/twitch-api-types/user-types';
import { useTeamInfo } from '../../hooks/team-hooks/use-team-info';
import { TeamResponse } from '../../utils/twitch-api-types/team-types';
import { TeamPanels } from '../teams/teams-list/team-panels-view';
import { UsernameSearchBox } from '../../features/searches/user-name-search';
import { UserByTypesSearch } from '../../features/searches/user-by-types-search-combo';
import { UserFilters } from '../../utils/search-types/broadcaster-types';
interface MainLayoutProps {
    broadcasterId: string;
}

const useStyles = makeStyles({
    headerProp: {
        top: 0,
        position: 'sticky',
        width: '100%',
        zIndex: tokens.zIndexFloating
    },
    searchLayout: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignContent: 'flex-start',
        gap: '1em',
        width: '100%',
        backgroundColor: tokens.colorNeutralBackground2,
        paddingX: tokens.spacingHorizontalM,
    },
    mainLayout: {
        display: 'grid',
        gridAutoFlow: 'row dense',
        gap: '1em',
        justifyContent: 'center',
        width: '100%',
        paddingTop: tokens.spacingVerticalL,
        paddingX: `${tokens.spacingHorizontalM} ${tokens.spacingHorizontalL}`,
        zIndex: tokens.zIndexBackground
    },
    footerNavBar: {
        width: '100%',
        bottom: 0,
        color: tokens.colorNeutralForeground1,
        justifyContent: "space-evenly",
        textAlign: "center",
        position: "sticky",
        zIndex: tokens.zIndexFloating,
    },
    removeOverflow: {
        overflowY: 'hidden'
    },
});



export const MainLayout: React.FC<MainLayoutProps> = ({ broadcasterId }) => {
    const { teams, loading, error } = useTeamInfo(broadcasterId);
    const [broadcasterInfo, { loading: broadcasterLoading, error: broadcasterError }] = useQuery<TwitchBroadcasterResponse, string>(getBroadcasterInfo, broadcasterId);
    const [selectedValue, setSelectedValue] = useState<TabValue>(teams[0]?.id);
    const [enableSearch, setEnableSearch] = useState<boolean>(false);
    const [usernameSearchInput, setUsernameSearchInput] = useState<string>('');
    const [teamLevelFilters, setTeamLevelFilters] = useState<UserFilters>({ broadcasterTypes: [], userTypes: [] });
    const styles = useStyles();

    if (loading || broadcasterLoading) return <Spinner appearance='primary' label={'Loading broadcaster data...'} labelPosition='before' />;
    if (broadcasterError) return <Body1Strong as="strong" align='center'>Error loading broadcaster information: <code>{broadcasterError}</code></Body1Strong>;
    if (error) return <Body1Strong as="strong" align='center'>Error loading broadcaster information: <code>{error.message}</code></Body1Strong>;

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const onSearchToggle = (isChecked: boolean): void => setEnableSearch(isChecked);
    const onUsernameSearch = (username: string): void => setUsernameSearchInput(username);
    const onFilterChange = (filters: UserFilters): void => {
        // Filter team members based on user type and broadcaster type
        console.log('Filter change', filters);
        if (filters) {
            setTeamLevelFilters({ ...filters });
        }
    }
    const team: TeamResponse = teams?.find((team) => team?.id === selectedValue) ?? teams[0];
    return (
        <div className={styles.removeOverflow}>
            {/* Header content */}
            <header className={styles.headerProp}>
                <HeaderComponent broadcasterName={broadcasterInfo[0].broadcaster_name ?? ""} isSearchEnabled={onSearchToggle} />
                <HeaderNav teams={teams} defaultTab={team?.id} onTabChange={onTabSelect} />
            </header>
            {/* Search Content */}
            {
                enableSearch ?
                    <section>
                        <aside className={styles.searchLayout}>
                            <UserByTypesSearch onFilterChange={onFilterChange} />
                        </aside>
                    </section>
                    : null
            }
            {/* Main content */}
            <main className={styles.mainLayout}>
                <TeamPanels currentTeamId={selectedValue as string} teams={teams} usernameToFilter={usernameSearchInput} teamLevelFilters={teamLevelFilters} />
            </main>
            {/* Footer content */}
            <footer className={styles.footerNavBar}>
                <Footer />
            </footer>
        </div>
    );
};