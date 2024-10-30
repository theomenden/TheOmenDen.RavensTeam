// src/components/HeaderNavigation.tsx
import React from 'react';
import { Button, Tab, TabList, Title1 } from '@fluentui/react-components';
import '../../../styles/HeaderNavigation.scss';
import { TeamDetails } from '../../../utils/twitch-api-types/team-types';
import { Head } from '../../seo/head';

interface HeaderProps {
    broadcasterName: string;
    teams: TeamDetails;
}

export const HeaderComponent: React.FC<HeaderProps> = ({ broadcasterName, teams}) => {
    const tabItems = Object.keys(teams).map((teamName) => ({
        key: teamName,
        text: teams[teamName].info,
        logo: teams[teamName].logoUrl,
    }));
    return (
        <header className="header-navigation">
            <Head title="Raven's Team" />
            <div className="header-content">
                <Title1 as="h1" align='center'>
                    {broadcasterName}'s Teams
                </Title1>
            </div>
        </header>
    );
};
