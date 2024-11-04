import React from 'react';
import { TeamDetails } from '../../../utils/twitch-api-types/team-types';
import '../../../styles/HeaderNavigation.scss';
import { TabList, Tab, Image, Subtitle1, makeStyles, tokens } from '@fluentui/react-components';

interface HeaderNavProps {
    teams: TeamDetails;
    selectedTab: string | null;
    onTabSelect: (tabName: string) => void;
}

const useStyles = makeStyles({
    headerNavRow: {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: tokens.spacingHorizontalM,
        marginRight: tokens.spacingHorizontalM,
        width: "100%",
        backgroundColor: tokens.colorNeutralBackground1,
    }
});

export const HeaderNav: React.FC<HeaderNavProps> = ({ teams, selectedTab, onTabSelect }: HeaderNavProps) => {
    const styles = useStyles();
    return (
        <nav className={styles.headerNavRow}>
            <TabList
                selectedValue={selectedTab}
                onTabSelect={(_event, data) => onTabSelect(data.value as string)}>
                {
                    Object.keys(teams).map((teamName) => (
                        <Tab key={teamName} value={teamName}>
                            <Image src={teams[teamName].logoUrl}
                                alt={`${teamName} icon`}
                                width='64'
                                height='64' />
                        </Tab>
                    ))
                }
            </TabList>
        </nav>
    );
};