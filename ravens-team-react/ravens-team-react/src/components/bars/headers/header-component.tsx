// src/components/HeaderNavigation.tsx
import React from 'react';
import { Title1 } from '@fluentui/react-components';
import '../../../styles/HeaderNavigation.scss';
import { Head } from '../../seo/head';

interface HeaderProps {
    broadcasterName: string;
}

export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
    return (
        <header className="header-navigation">
            <Head title="Raven's Team" />
                <Title1 as="h1" align='center'>
                    {props.broadcasterName}'s Teams
                </Title1>
        </header>
    );
};
