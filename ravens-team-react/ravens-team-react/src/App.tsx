import './styles/App.scss';
import MainLayout from './components/layouts/main-layout';
import React, { useEffect, useState } from 'react';
import { useTwitchAuth } from './hooks/ext-auth-hooks/use-ext-auth';
const App: React.FC = () => {
    // Get broadcasterId and authToken from Twitch extension helper
    const { broadcasterId, authToken, loading: authLoading, error: authError } = useTwitchAuth();
   
    // If auth data is still loading, show loading state
    if (authLoading) return <div>Loading Twitch authentication...</div>;
    if (authError || !broadcasterId || !authToken) return <div>Error: {authError || "Unable to get Twitch auth data."}</div>;

    return (
        <>
            <MainLayout broadcasterId={broadcasterId || ''} helixAuthToken={authToken || ''} />
        </>
    );
};

export default App;