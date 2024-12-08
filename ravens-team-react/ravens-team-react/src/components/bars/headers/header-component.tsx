// src/components/HeaderNavigation.tsx
import React from 'react';
import { makeStyles, Title1, tokens, Image } from '@fluentui/react-components';
import { Head } from '../../seo/head';
import { EnableSearchSwitch } from '../../../features/searches/enable-searching';

interface HeaderProps {
    broadcasterName: string;
}

const useStyles = makeStyles({
    headerNavProp: {
        backgroundColor: tokens.colorBrandBackground2,
        color: tokens.colorNeutralForeground1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr',
        gridTemplateAreas: '"title search"',
    },
    searchProp: {
        gridArea: 'search',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextProp: {
        gridArea: 'title',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightBold,
    }
});

export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
    const styles = useStyles();

    const onSwitchChange = (checked: boolean) => {
        console.log(checked);
    }
    return (
        <div className={styles.headerNavProp}>
            <Head title="Raven's Team" />
            <Title1 as="h1" align='center' className={styles.headerTextProp}>
                {props.broadcasterName}'s Teams
            </Title1>
            <div className={styles.searchProp} >
                <EnableSearchSwitch onSwitchChange={onSwitchChange} />
            </div>
        </div>
    );
};
