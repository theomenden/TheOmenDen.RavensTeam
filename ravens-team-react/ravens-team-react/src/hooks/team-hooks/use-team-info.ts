// src/hooks/useTeamData.ts
import { getTeamsForBroadcaster } from '../../utils/twitchApi';
import { TeamResponse } from '../../utils/twitch-api-types/team-types';
import { useEffect, useState } from 'react';

export const useTeamInfo = (broadcasterId: string) => {
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        setLoading(true);
        const teamData: TeamResponse[] = [];

        const getTeamDataAsync = async () => {
            const response = await getTeamsForBroadcaster(broadcasterId);
            if (response.data) {
                response.data.forEach((team: TeamResponse) => {
                    teamData.push(team);
                });
            }
            setTeams(teamData);
            setLoading(false);
        }

        try{
        getTeamDataAsync();
        } catch(error){
            setError(error as Error);
        }
    }, [broadcasterId]);
    return { teams, loading, error };
};
