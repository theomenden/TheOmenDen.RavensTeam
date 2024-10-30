// src/services/twitchApi.ts
import axiosInstance from './axios-instance';
import { TeamInfoResponse, TeamMembersResponse, TeamMember, TeamResponse } from './twitch-api-types/team-types';
import { TwitchBroadcasterInfo, TwitchBroadcasterResponse, TwitchUser, TwitchUserResponse } from './twitch-api-types/user-types';

const authHeaders = (accessToken: string) => ({
    headers: {
        Authorization: `Extension ${accessToken}`,
    },
});

/**
 * Fetch team members from the Twitch API.
 * @param teamId - The id of the team to fetch.
 * @param accessToken - The access token for authentication.
 * @returns A promise resolving to a list of team members or null on failure.
 */
export const getTeamMembers = async (teamId: string, accessToken: string): Promise<TeamMember[] | null> => {
    try {
        const response = await axiosInstance.get<TeamMembersResponse>(`/teams?id=${teamId}`, authHeaders(accessToken));
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch team members:", error);
        return null; // Graceful fallback
    }
};

/**
 * Fetch teams for a given broadcaster from the Twitch API.
 * @param broadcasterId - The broadcaster's ID.
 * @param accessToken - The access token for authentication.
 * @returns A promise resolving to an array of teams or null on failure.
 */
export const getTeams = async (broadcasterId: string, accessToken: string): Promise<TeamResponse[] | null> => {
    try {
        const response = await axiosInstance.get<TeamInfoResponse>(`/teams/channel?broadcaster_id=${broadcasterId}`, authHeaders(accessToken));
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch team information:", error);
        return null; // Graceful fallback
    }
};

export const getUsers = async (userNames: string[], accessToken: string): Promise<TwitchUser[] | null> => {
    try {
        const userList = userNames.map((name) => `login=${name}`).join('&');
        const response = await axiosInstance.get<TwitchUserResponse>(`/users?${userList}`, authHeaders(accessToken));
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return null; // Graceful fallback
    }
}

export const getBroadcasterInfo = async (broadcasterId: string, accessToken: string): Promise<TwitchBroadcasterInfo | null> => {
    try{
        const response = await axiosInstance.get<TwitchBroadcasterResponse>(`/channels?broadcaster_id=${broadcasterId}`, authHeaders(accessToken));
        return response.data.data[0]; // Assuming there's only one broadcaster in the response
    } catch (error) {
        console.error("Failed to fetch broadcaster info:", error);
        return null; // Graceful fallback
    }
}

