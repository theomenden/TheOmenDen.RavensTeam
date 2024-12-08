// src/components/Footer.tsx
import React from 'react';
import { Text, Title2, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
    footerNavBar: {
        backgroundColor: tokens.colorBrandBackground2,
        color: tokens.colorNeutralForeground1,
        justifyContent: "space-between",
        textAlign: "center",
        position: "sticky",
        bottom: 0,
        zIndex: 100,
        boxShadow: tokens.shadow8Brand
    }
})

export const Footer: React.FC = () => {
    const styles = useStyles();
  return( 
        <nav className={styles.footerNavBar}>
        <Title2 as="h3" align='center'>The Omen Den</Title2>
        </nav>
  );
};
