import React from 'react';
import { TeamDetails } from '../../../utils/twitch-api-types/team-types';
import '../../../styles/HeaderNavigation.scss';
import { TabList, Tab, Image, Subtitle1, makeStyles, tokens, Subtitle2Stronger, Divider } from '@fluentui/react-components';

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
    }
});

export const HeaderNav: React.FC<HeaderNavProps> = ({ teams, selectedTab, onTabSelect }: HeaderNavProps) => {
    const styles = useStyles();
    return (
        <div>
            <nav className={styles.headerNavRow}>
                <TabList
                    selectedValue={selectedTab}
                    onTabSelect={(_event, data) => onTabSelect(data.value as string)}>
                    {
                        Object.keys(teams).map((teamName) => (
                            <Tab key={teamName} value={teamName}>
                                <Image src={teams[teamName].logoUrl}
                                    alt={`${teamName} logo`}
                                    width='56'
                                    height='56' />
                            </Tab>
                        ))
                    }
                </TabList>
            </nav>
            <Subtitle2Stronger as="h5" align='center' className={styles.textSpacing} >{selectedTab}</Subtitle2Stronger>
            <Divider appearance='brand' className={styles.dividerSpacing} />    
        </div>

    );
};