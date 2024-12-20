import * as React from 'react';
import { Helmet, HelmetData } from 'react-helmet-async';
type HeadProps = {
    title?: string;
    description?: string;
};

const helmetData = new HelmetData({});

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
    return (
        <Helmet
            helmetData={helmetData}
            title={title ? `${title} | Raven's Team React` : undefined}
            defaultTitle="Raven's Team React"
        >
            <meta name="description" content={description} />
        </Helmet>
    );
};
