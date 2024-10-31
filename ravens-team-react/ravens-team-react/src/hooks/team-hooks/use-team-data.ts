// src/hooks/useTeamData.ts
import { useEffect, useState } from 'react';
import { getTeamMembers, getTeams, getUsers } from '../../utils/twitchApi';
import { TeamDetails, TeamImages, TeamMember, TeamMembersByTeam, TeamResponse } from '../../utils/twitch-api-types/team-types';
import { TwitchUser } from '../../utils/twitch-api-types/user-types';

interface UseTeamDataProps {
    broadcasterId: string;
    accessToken: string;
}


const BATCH_SIZE = 100; // Twitch allows up to 100 logins in a single getUsers call

export const useTeamData = ({ broadcasterId, accessToken }: UseTeamDataProps) => {
    const [teamMembersByTeam, setTeamMembersByTeam] = useState<TeamMembersByTeam>({});
    const [teamDetails, setTeamDetails] = useState<TeamDetails>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            setError(null);

            try {
                const teamData = await getTeams(broadcasterId, accessToken);
                if (teamData && teamData.length > 0) {
                    const teamMembersDict: TeamMembersByTeam = {};
                    const teamImagesDict: TeamDetails = {};

                    for (const team of teamData) {
                        const allUsernames: string[] = [];
                        const members = await getTeamMembers(team.id, accessToken);
                        const memberUsers = members && members.flatMap((member) => member.users);
                        if (memberUsers) {
                            allUsernames.push(...memberUsers.map((user) => user.user_login));
                            teamImagesDict[team.team_display_name] = {
                                id: team.id,
                                logoUrl: team.thumbnail_url,
                                info: team.info
                            };
                        }

                        // Fetch user details in batches of 100
                        const userDetails: TwitchUser[] = [];
                        for (let i = 0; i < allUsernames.length; i += BATCH_SIZE) {
                            const batch = allUsernames.slice(i, i + BATCH_SIZE);
                            const users = await getUsers(batch, accessToken);
                            if (users) {
                                userDetails.push(...users);
                            }
                        }

                        // Store users under their team display name in the dictionary
                        teamMembersDict[team.team_display_name] = userDetails;
                    }
                    setTeamDetails(teamDetails);
                    setTeamMembersByTeam(teamMembersDict);
                } else {
                    setError("No teams found for this broadcaster.");
                }
            } catch (err) {
                setError("Error loading team data.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [broadcasterId, accessToken]);

    return { teamMembersByTeam, teamDetails, loading, error };
};
