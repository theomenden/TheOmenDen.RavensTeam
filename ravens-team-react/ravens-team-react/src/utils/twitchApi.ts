// src/services/twitchApi.ts
import { AxiosRequestConfig } from 'axios';
import axios from './axios-instance';
import { TeamInfoResponse, TeamMembersResponse, TeamMember, TeamResponse } from './twitch-api-types/team-types';
import { TwitchBroadcasterInfo, TwitchBroadcasterResponse, TwitchUser, TwitchUserResponse } from './twitch-api-types/user-types';
import { CacheAxiosResponse } from 'axios-cache-interceptor';

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
        const response = await axios.get<TeamMembersResponse>(`/teams?id=${teamId}`, authHeaders(accessToken));
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
        const response = await axios.get<TeamInfoResponse>(`/teams/channel?broadcaster_id=${broadcasterId}`, authHeaders(accessToken));
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch team information:", error);
        return null; // Graceful fallback
    }
};

export const getUsers = async (userNames: string[], accessToken: string): Promise<TwitchUser[] | null> => {
    try {
        const userList = userNames.map((name) => `login=${name}`).join('&');
        const response = await axios.get<TwitchUserResponse>(`/users?${userList}`, authHeaders(accessToken));
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return null; // Graceful fallback
    }
}

export const getBroadcasterInfo = async (broadcasterId: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TwitchBroadcasterResponse>> => {
        return await axios.get<TwitchBroadcasterResponse>(`/channels?broadcaster_id=${broadcasterId}`, config);
}

export const getTeamsForBroadcaster = async (broadcasterId: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TeamInfoResponse>> => {
    return await axios.get<TeamInfoResponse>(`/teams/channel?broadcaster_id=${broadcasterId}`, config);
}

export const getChunkedUsersDetails = async (userNames: string[], config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TwitchUserResponse>> => {
    console.log('Fetching user details for:', userNames);
    const userList = userNames.map((name) => `login=${name}`).join('&');
    return await axios.get<TwitchUserResponse>(`/users?${userList}`, config);
}

export const getUserDetails = async (userName: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TwitchUserResponse>> => {
    return await axios.get<TwitchUserResponse>(`/users?login=${userName}`, config);
}

export const getChunkedTeamMembers = async (teamId: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TeamMembersResponse>> => {
    return await axios.get<TeamMembersResponse>(`/teams?id=${teamId}`, config);
}