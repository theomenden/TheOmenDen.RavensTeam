import './styles/App.scss';
import { TeamList } from './components/teams/teams-list/team-list';
import { ContentLayout } from './components/layouts/content-layout';
import {Text} from '@fluentui/react-components';
import React, { useEffect, useState } from 'react';
export default function App() {
  const [broadcasterId, setBroadcasterId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      // Initialize Twitch extension authentication
      if (window.Twitch && window.Twitch.ext) {
          window.Twitch.ext.onAuthorized((auth) => {
              setAccessToken(auth.token);
              setBroadcasterId(auth.channelId); // Set broadcaster ID for team fetch
          });
      } else {
          setError("Twitch extension helper is not available.");
      }
  }, []);

  if (error) {
      return <Text as="h3">{error}</Text>;
  }

  if (!accessToken || !broadcasterId) {
      return <Text as="h3">Loading Twitch authentication...</Text>;
  }

  return (
    <>
    <div>
    <ContentLayout title="Raven's Team">
      <div>
      <TeamList broadcasterId={broadcasterId} accessToken={accessToken} />
      </div>
    </ContentLayout>
        </div>
    </>
  )
};
