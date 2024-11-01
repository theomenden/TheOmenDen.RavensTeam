// src/components/Footer.tsx
import React from 'react';
import { Text, Title2 } from '@fluentui/react-components';
import '../../../styles/Footer.scss';

const Footer: React.FC = () => (
    <footer className='footer'>
        <nav>
        <Title2 as="h3" align='center'>The Omen Den</Title2>
        </nav>
    </footer>
);

export default Footer;
