import { getChunkedUsersDetails } from './../../utils/twitchApi';
import { BasicTwitchUser } from './../../utils/twitch-api-types/team-types';
import {useEffect, useState} from 'react';
import { TwitchUser } from '../../utils/twitch-api-types/user-types';

export const useBatchRequests = (basicTwitchUsers: BasicTwitchUser[][]) => {
    const [userDetails, setUserDetails] = useState<TwitchUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
    setLoading(true);
    setError(null);
    const getRequestPromises: Promise<number | void>[] = [];
    const userData: TwitchUser[] = [];
        for(const chunk of basicTwitchUsers) {
            const userNames = chunk.map(user => user.user_login);
            const response = getChunkedUsersDetails(userNames)
            .then(response => response.data)
            .then(data => userData.push(...data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
            getRequestPromises.push(response);
        }
      const resolvedUserData = async() => await  Promise.allSettled(getRequestPromises);
        try {
            resolvedUserData();
            setUserDetails(userData);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }, [basicTwitchUsers]);
    return {userDetails, loading, error};
}