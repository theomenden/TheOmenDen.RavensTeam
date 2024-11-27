// src/services/twitchApi.ts
import { AxiosRequestConfig } from 'axios';
import axios from './axios-instance';
import { TeamInfoResponse, TeamMembersResponse } from './twitch-api-types/team-types';
import { TwitchBroadcasterResponse, TwitchUserResponse } from './twitch-api-types/user-types';
import { StreamDataResponse } from './twitch-api-types/stream-types';

export const getBroadcasterInfo = async (broadcasterId: string, config?: AxiosRequestConfig): Promise<TwitchBroadcasterResponse> => {
        const response = await axios.get<TwitchBroadcasterResponse>("/channels", {params:{'broadcaster_id': broadcasterId}, ...config});
        return response.data;
}

export const getTeamsForBroadcaster = async (broadcasterId: string, config?: AxiosRequestConfig<TeamInfoResponse>): Promise<TeamInfoResponse> => {
    const response = await axios.get<TeamInfoResponse>("/teams/channel", { params: { 'broadcaster_id': broadcasterId }, ...config });
    return response.data;
}

export const getChunkedUsersDetails = async (userNames: string, config?: AxiosRequestConfig): Promise<TwitchUserResponse> => {
    const response = await axios.get<TwitchUserResponse>(`/users?${userNames}`, {...config});
    return response.data;
}

export const getUserDetails = async (userName: string, config?: AxiosRequestConfig): Promise<TwitchUserResponse> => {
    const response = await axios.get<TwitchUserResponse>("/users", {params:{'login':userName}, ...config});
    return response.data;
}

export const getChunkedTeamMembers = async (teamId: string, config?: AxiosRequestConfig): Promise<TeamMembersResponse> => {
    const response =  await axios.get<TeamMembersResponse>("/teams", {params:{'id': teamId},...config});
    return response.data;
}

export const getStreamDetails = async (twitchUserId: string, config?: AxiosRequestConfig): Promise<StreamDataResponse> => {
    const response = await axios.get<StreamDataResponse>("/streams",{params:{'user_id': twitchUserId} ,...config});
    return response.data;
}