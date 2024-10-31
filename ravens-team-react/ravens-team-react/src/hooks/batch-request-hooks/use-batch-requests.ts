import { BasicTwitchUser } from './../../utils/twitch-api-types/team-types';
import {useEffect, useState} from 'react';
import axios, {useQuery} from '../../utils/axios-instance';
import { BasicTwitchUser } from '../../utils/twitch-api-types/team-types';
import { getChunkedUsersDetails } from '../../utils/twitchApi';
import { TwitchUser } from '../../utils/twitch-api-types/user-types';

interface UserDetailsParams {
    basicTwitchUsers: BasicTwitchUser[];
}

const createUserQueryString = (usernames : string[]) => {
    return usernames.map(username => `login=${username}`).join('&');
};

const subsetUsers = (users: BasicTwitchUser[]): Array<Array<string>> => {
    const BATCH_SIZE: number = 100;

    const subsets: Array<Array<string>> = [];
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
        subsets.push(users.slice(i, i + BATCH_SIZE).map(user => user.user_login));
    }
    return subsets;
};

export const useBatchRequests = (props: UserDetailsParams) => {
   const [userDetails, {loading, error}] = useQuery(getChunkedUsersDetails,[]);
}