// src/hooks/useTeamData.ts
import { getTeamsForBroadcaster } from '../../utils/twitchApi';
import { TeamDetails, TeamInfoResponse, TeamResponse } from '../../utils/twitch-api-types/team-types';
import { useQuery } from '../../utils/axios-instance';
import { useEffect, useState } from 'react';

export const useTeamData = (broadcasterId: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [teams, setTeams] = useState<TeamDetails>({});
   useEffect(() => {
    const teamInfo: TeamDetails = {};
    // Fetch team data from the API using the 'getTeamsForBroadcaster' function
    // The API response is then parsed into a TeamInfoResponse object using the 'getTeamsForBroadcaster' function
    // The 'getTeamsForBroadcaster' function is assumed to be a custom API request function that fetches team data for a broadcaster
    getTeamsForBroadcaster(broadcasterId)
       .then((response) => {
            setLoading(false);
            const teamInfoResponse: TeamResponse[] = response.data;
            if (teamInfoResponse) {
                teamInfoResponse.forEach((team: TeamResponse) => {
                    teamInfo[team.team_display_name] = {
                        id: team.id,
                        logoUrl: team.thumbnail_url,
                        info: team.info,
                    };
                });
                setTeams(teamInfo);
            }
        })
       .catch((error) => {
            setLoading(false);
            setError(error);
        });
    },[broadcasterId]);
    return {teams, loading, error};
};
