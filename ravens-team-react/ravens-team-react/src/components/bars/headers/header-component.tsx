// src/components/HeaderNavigation.tsx
import React from 'react';
import { makeStyles, Title1, tokens, Image } from '@fluentui/react-components';
import { Head } from '../../seo/head';

interface HeaderProps {
    broadcasterName: string;
}

const useStyles = makeStyles({
    headerNavProp:{
    backgroundColor:  tokens.colorBrandBackground,
    color: tokens.colorNeutralForeground1,
    alignItems: "center",
    justifyContent: "space-evenly",
    textAlign: "center"
    },
    headerTextProp: {
        fontSize: tokens.fontSizeHero800,
        paddingRight: tokens.spacingHorizontalL,
        paddingLeft: tokens.spacingHorizontalSNudge,
        paddingTop: tokens.spacingVerticalL,
        fontWeight: tokens.fontWeightSemibold,
    }
});

export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
    const styles = useStyles();
    return (
        <div className={styles.headerNavProp}>
            <Head title="Raven's Team" />
                <Title1 as="h1" align='center' className={styles.headerTextProp}>
                    {props.broadcasterName}'s Teams
                </Title1>
        </div>
    );
};
