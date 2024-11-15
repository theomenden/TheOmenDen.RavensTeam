// src/services/twitchApi.ts
import { AxiosRequestConfig } from 'axios';
import axios from './axios-instance';
import { TeamInfoResponse, TeamMembersResponse } from './twitch-api-types/team-types';
import { TwitchBroadcasterResponse, TwitchUserResponse } from './twitch-api-types/user-types';
import { CacheAxiosResponse } from 'axios-cache-interceptor';
import { StreamDataResponse } from './twitch-api-types/stream-types';

export const getBroadcasterInfo = async (broadcasterId: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TwitchBroadcasterResponse>> => {
        return await axios.get<TwitchBroadcasterResponse>(`/channels?broadcaster_id=${broadcasterId}`, config);
}

export const getTeamsForBroadcaster = async (broadcasterId: string, config?: AxiosRequestConfig<TeamInfoResponse>): Promise<TeamInfoResponse> => {
    const response = await axios.get<TeamInfoResponse>(`/teams/channel`, { params: { 'broadcaster_id': broadcasterId }, ...config });
    return response.data;
}

export const getChunkedUsersDetails = async (userNames: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TwitchUserResponse>> => {
    return await axios.get<TwitchUserResponse>(`/users?${userNames}`, {...config});
}

export const getUserDetails = async (userName: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TwitchUserResponse>> => {
    return await axios.get<TwitchUserResponse>(`/users`, {params:{'login':userName}, ...config});
}

export const getChunkedTeamMembers = async (teamId: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<TeamMembersResponse>> => {
    return await axios.get<TeamMembersResponse>(`/teams`, {params:{'id': teamId},...config});
}

export const getStreamDetails = async (twitchUserId: string, config?: AxiosRequestConfig): Promise<CacheAxiosResponse<StreamDataResponse>> => {
    return await axios.get<StreamDataResponse>(`/streams`,{params:{'user_id': twitchUserId} ,...config});
}