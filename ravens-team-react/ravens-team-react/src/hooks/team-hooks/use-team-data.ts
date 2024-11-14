// src/hooks/useTeamData.ts
import { getTeamsForBroadcaster } from '../../utils/twitchApi';
import { TeamDetails, TeamInfoResponse, TeamResponse } from '../../utils/twitch-api-types/team-types';
import { useQuery } from '../../utils/axios-instance';
import { useEffect, useState } from 'react';

export const useTeamData = (broadcasterId: string) => {
   const [teamDetails, {loading, error}] = useQuery(getTeamsForBroadcaster, broadcasterId);
    const [teams, setTeams] = useState<TeamDetails>({});
   useEffect(() => {
    const teamInfo: TeamDetails = {};
    if (teamDetails) {
        teamDetails.data.forEach((team: { team_display_name: string | number; id: any; thumbnail_url: any; info: any; }) => {
            teamInfo[team.team_display_name] = {
                id: team.id,
                logoUrl: team.thumbnail_url,
                info: team.info,
            };
        });
        setTeams(teamInfo);
    }},[broadcasterId]);

    return {teams, loading, error};
};
