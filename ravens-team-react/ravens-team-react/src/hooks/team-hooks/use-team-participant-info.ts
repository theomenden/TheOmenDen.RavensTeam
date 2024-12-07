import { useEffect, useState } from "react";
import { BasicTwitchUser, TeamDetailsByTeam, TeamResponse } from "../../utils/twitch-api-types/team-types";
import { getChunkedTeamMembers } from "../../utils/twitchApi";

const batchReduceTeamUsers = ({ arr, batchSize }: { arr: BasicTwitchUser[]; batchSize: number; }): BasicTwitchUser[][] => {
    return arr.reduce((batches, _, i) => {
        if (i % batchSize === 0) batches.push([]);
        batches[batches.length - 1].push(arr[i]);
        return batches;
    }, [] as BasicTwitchUser[][]);
};

export const useTeamParticipants = (teams: TeamResponse[]) => {
    const [resolvedTeamMembersbyTeam, setTeamMembersByTeam] = useState<TeamDetailsByTeam>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        const teamMembersByTeam: TeamDetailsByTeam = {};
        const teamIds = teams.map(team => team.id);
        const getTeamDataAsync = () => {
            teamIds.forEach(async (teamId) => {
                const teamResponse = await getChunkedTeamMembers(teamId);
                const basicTwitchUserData: BasicTwitchUser[] = teamResponse.data.flatMap(member => member.users);
                const reducedTeamMembers: BasicTwitchUser[][] = batchReduceTeamUsers({ arr: basicTwitchUserData, batchSize: 100 });
                teamMembersByTeam[teamId] = [];
                teamMembersByTeam[teamId].push(...reducedTeamMembers);
            })};   
        try {          
            getTeamDataAsync();
            setTeamMembersByTeam(teamMembersByTeam);
        }
        catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }, [teams]);
    return {resolvedTeamMembersbyTeam, loading, error};
}