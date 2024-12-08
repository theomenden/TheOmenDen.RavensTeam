import React, { useMemo } from 'react';
import { TeamResponse } from '../../../utils/twitch-api-types/team-types';
import { TabList, Tab, Image, makeStyles, tokens, SelectTabEvent, SelectTabData, Tooltip } from '@fluentui/react-components';

interface HeaderNavProps {
    teams: TeamResponse[];
    defaultTab: string | null;
    onTabChange: (event: SelectTabEvent, data: SelectTabData) => void;
}
const useStyles = makeStyles({
    headerNavRow: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
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
                             <Tooltip withArrow content={team.team_display_name} relationship="label">
                             <Image src={team.thumbnail_url}
                                fit='contain'
                                shape="circular"
                                bordered
                                alt={`${team.team_display_name} logo`}
                                className={styles.tabImage} />
                             </Tooltip>
                        </Tab>
                    ))
                }
            </TabList>
        </nav >
    );
};