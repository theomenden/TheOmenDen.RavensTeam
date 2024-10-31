import React from 'react';
import { TeamDetails } from '../../../utils/twitch-api-types/team-types';
import '../../../styles/HeaderNavigation.scss';
import { TabList, Tab, Image, Subtitle1 } from '@fluentui/react-components';

interface HeaderNavProps {
    teams: TeamDetails;
    selectedTab: string | null;
    onTabSelect: (tabName: string) => void;
}


export const HeaderNav: React.FC<HeaderNavProps> = ({ teams, selectedTab, onTabSelect}: HeaderNavProps) => {
    return(
        <nav>
                <TabList
                    selectedValue={selectedTab}
                    onTabSelect={(event, data) => onTabSelect(data.value as string)}>
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