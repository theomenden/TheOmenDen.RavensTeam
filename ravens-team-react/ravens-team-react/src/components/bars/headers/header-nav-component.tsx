import React, { useMemo } from 'react';
import { TeamResponse } from '../../../utils/twitch-api-types/team-types';
import { TabList, Tab, Image, makeStyles, tokens, SelectTabEvent, SelectTabData } from '@fluentui/react-components';

interface HeaderNavProps {
    teams: TeamResponse[];
    defaultTab: string | null;
    onTabChange: (event: SelectTabEvent, data: SelectTabData) => void;
}
const useStyles = makeStyles({
    headerNavRow: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        width: "100%",
        backgroundColor: tokens.colorNeutralBackground2,
    },
    headerTitleRow: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        width: "100%",
        backgroundColor: tokens.colorNeutralBackground3,
    },
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
    },
    tabImage: {
        width: '56px',
        height: '56px',
        backgroundColor: tokens.colorNeutralBackground1,
        boxShadow: tokens.shadow8Brand
    }
});

export const HeaderNav: React.FC<HeaderNavProps> = ({ teams, defaultTab, onTabChange }: HeaderNavProps) => {
    const styles = useStyles();
    return (
        <nav className={styles.headerNavRow}>
            <TabList
                defaultSelectedValue={defaultTab}
                onTabSelect={onTabChange}
                selectTabOnFocus={true}
                className={styles.headerTitleRow}>
                {
                    teams.map((team) => (
                        <Tab id={team.team_name} value={team.id} aria-label={team.team_display_name}>
                            <Image src={team.thumbnail_url}
                                fit='contain'
                                shape="circular"
                                alt={`${team.team_display_name} logo`}
                                className={styles.tabImage} />
                        </Tab>
                    ))
                }
            </TabList>
        </nav >
    );
};