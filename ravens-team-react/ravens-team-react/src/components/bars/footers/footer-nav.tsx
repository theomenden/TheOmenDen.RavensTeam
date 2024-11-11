// src/components/Footer.tsx
import React from 'react';
import { Text, Title2, makeStyles, tokens } from '@fluentui/react-components';
import '../../../styles/Footer.scss';

const useStyles = makeStyles({
    footerNavBar: {
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForeground1,
        justifyContent: "space-between",
        textAlign: "center",
        position: "sticky",
        bottom: 0,
        paddingTop: tokens.spacingVerticalSNudge,
        paddingBottom: tokens.spacingVerticalSNudge,
        zIndex: 100,
        boxShadow: tokens.shadow8Brand
    }
})

export const Footer: React.FC = () => {
    const styles = useStyles();
  return( 
  <footer className={styles.footerNavBar}>
        <nav>
        <Title2 as="h3" align='center'>The Omen Den</Title2>
        </nav>
    </footer>
  );
};
