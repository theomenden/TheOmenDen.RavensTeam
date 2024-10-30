import React from 'react';
import { TeamDetails } from '../../../utils/twitch-api-types/team-types';
import '../../../styles/HeaderNavigation.scss';
import { TabList, Tab, Image, TabListProps, makeStyles, Subtitle1 } from '@fluentui/react-components';

interface HeaderNavProps {
    broadcasterName: string;
    teams: TeamDetails;
    selectedTab: string | null;
    onTabSelect: (tabName: string) => void;
}


export const HeaderNav: React.FC<HeaderNavProps> = ({broadcasterName, teams, selectedTab, onTabSelect}: HeaderNavProps) => {
    return(
        <nav>
                <TabList
                    selectedValue={selectedTab}
                    onTabSelect={(event, data) => onTabSelect(data.value as string)}
                    className="header-navigation__tab-list"
                >
                    {
                        Object.keys(teams).map((teamName) => (
                            <Tab key={teamName} value={teamName} className="team-tab">
                                <Image
                                    src={teams[teamName].logoUrl}
                                    alt={`${teamName} icon`}
                                    className="team-tab__icon"
                                />
                                <Subtitle1 as="h3" className="team-tab__text">{teamName}</Subtitle1>
                            </Tab>
                        ))
                    }
                </TabList>
        </nav>
    );
};