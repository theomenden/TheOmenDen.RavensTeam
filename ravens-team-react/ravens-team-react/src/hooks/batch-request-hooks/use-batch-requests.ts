import { getChunkedUsersDetails } from './../../utils/twitchApi';
import { BasicTwitchUser } from './../../utils/twitch-api-types/team-types';
import {useEffect, useState} from 'react';
import { TwitchUser } from '../../utils/twitch-api-types/user-types';

const createUserQueryString = (usernames : string[]): string => {
    return usernames.map(username => `login=${username}`).join('&');
};

export const useBatchRequests = (basicTwitchUsers: BasicTwitchUser[][]) => {
    const [userDetails, setUserDetails] = useState<TwitchUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
    setLoading(true);
    setError(null);
        for(const chunk of basicTwitchUsers) {
            const userNames = chunk.map(user => user.user_login);
            const response = getChunkedUsersDetails(createUserQueryString(userNames))
            .then(response => response.data)
            .then(data => setUserDetails([...userDetails, ...data.data]))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
            Promise.resolve(response);
        }
        setLoading(false);
    }, [basicTwitchUsers])

    return {userDetails, loading, error};
}