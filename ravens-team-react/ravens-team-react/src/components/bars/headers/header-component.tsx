// src/components/HeaderNavigation.tsx
import React from 'react';
import { makeStyles, Title1, tokens, Switch } from '@fluentui/react-components';
import { Head } from '../../seo/head';
import { Filter16Filled, FilterDismiss16Filled } from '@fluentui/react-icons';

interface HeaderProps {
    broadcasterName: string;
    isSearchEnabled: (checked: boolean) => void;
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
    },
    wrapper: {
        display: "flex",
        justifyContent: "flex-start",
        marginLeft: tokens.spacingHorizontalS,
        marginBottom: tokens.spacingVerticalS,
    }
});

export const HeaderComponent: React.FC<HeaderProps> = ({ broadcasterName, isSearchEnabled }: HeaderProps) => {
    const styles = useStyles();
    const [isChecked, setChecked] = React.useState<boolean>(false);
    const onChange = React.useCallback(
        (ev: { currentTarget: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
            setChecked(ev.currentTarget.checked);
        },
        [setChecked]
    );
    isSearchEnabled(isChecked);
    const checkedIcon = isChecked ? <Filter16Filled /> : <FilterDismiss16Filled />;
    return (
        <div className={styles.headerNavProp}>
            <Head title="Raven's Team" />
            <Title1 as="h1" align='center' className={styles.headerTextProp}>
                {broadcasterName}'s Teams
            </Title1>
            <div className={styles.searchProp} >
                <div className={styles.wrapper}>
                    <Switch
                        checked={isChecked}
                        onChange={onChange}
                        label={checkedIcon}
                        labelPosition="after"
                    />
                </div>
            </div>
        </div>
    );
};
