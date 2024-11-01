import { BasicTwitchUser } from './../../utils/twitch-api-types/team-types';
import {useEffect, useState} from 'react';
import { getChunkedUsersDetails } from '../../utils/twitchApi';
import { TwitchUser } from '../../utils/twitch-api-types/user-types';

const BATCH_SIZE: number = 100;
const createUserQueryString = (usernames : string[]): string => {
    return usernames.map(username => `login=${username}`).join('&');
};

export const useBatchRequests = (basicTwitchUsers: BasicTwitchUser[]) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<TwitchUser[]>([]);

    useEffect(() => {
        setLoading(true);
        setError(null);
    const fetchTeamData = async () => {
        try{
            const fetchedUserDetails: TwitchUser[] = [];
            const allUsernames: string[] = basicTwitchUsers.map(user => user.user_login);
            for (let i = 0; i < allUsernames.length; i += BATCH_SIZE) {
                const batch = createUserQueryString(allUsernames.slice(i, i + BATCH_SIZE));
                const users = await getChunkedUsersDetails(batch);
                if (users) {
                    fetchedUserDetails.push(...users.data.data);
                }
            }
        setUserDetails(fetchedUserDetails);
        } catch (e) {
            console.error('Error fetching user details:', e);
            setError((e as Error)?.message ?? 'An error occurred');   
        } finally {
            setLoading(false);
        }
    };
fetchTeamData();
   },[basicTwitchUsers]);
   return { userDetails, loading, error };
}