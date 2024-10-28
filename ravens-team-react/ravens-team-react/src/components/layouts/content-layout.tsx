import * as React from 'react';
import '../../App.css';
import { Head } from '../seo/head';
import { Text } from '@fluentui/react-components';
type ContentLayoutProps = {
    children: React.ReactNode;
    title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
    return (
        <>
            <Head title={title} />
            <header>
                <nav>
                <div className='row'>
                    <div className="col">
                    <Text as="h1">{title}</Text>
                    </div>
                </div>
                </nav>
            </header>
            <main>
            <div className="container">
                <div className="row">
                    <div className="col">
                        {children}
                    </div>
                </div>
            </div>
            </main>
            
        </>
    );
};
