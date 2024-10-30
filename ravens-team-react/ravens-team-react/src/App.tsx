import './styles/App.scss';
import MainLayout from './components/layouts/main-layout';
import { Text } from '@fluentui/react-components';
import React, { useEffect, useState } from 'react';
import { useTeamData } from './hooks/team-hooks/use-team-data';
import { useBroadcasterInfo } from './hooks/broadcaster-hooks/use-broadcaster-data';
import { useTwitchAuth } from './hooks/ext-auth-hooks/use-ext-auth';
const App: React.FC = () => {
    // Get broadcasterId and authToken from Twitch extension helper
    const { broadcasterId, authToken, loading: authLoading, error: authError } = useTwitchAuth();
   
    // // Fetch broadcaster information using the custom hook
    // const { broadcasterInfo, loading: infoLoading, error: infoError } = useBroadcasterInfo({ broadcasterId: broadcasterId, accessToken: authToken });
    // // Fetch team members and teams using the custom hook
    // // Fetch broadcaster name and teams using the custom hook
    // const { teamMembersByTeam, teamDetails, loading: dataLoading, error: dataError } = useTeamData({ broadcasterId, accessToken: authToken });

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