import { useEffect, useState } from 'react';
import { TwitchBroadcasterInfo } from '../../utils/twitch-api-types/user-types';
import { getBroadcasterInfo } from '../../utils/twitchApi';

interface UseBroadcasterInfoProps {
    broadcasterId: string;
    accessToken: string;
}

export const useBroadcasterInfo = ({ broadcasterId, accessToken }: UseBroadcasterInfoProps) => {
    const [broadcasterInfo, setBroadcasterInfo] = useState<TwitchBroadcasterInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBroadcasterInfo = async () => {
            setLoading(true);
            setError(null);

            try {
                const info = await getBroadcasterInfo(broadcasterId);
                if (info) {
                    setBroadcasterInfo(info.data[0]);
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBroadcasterInfo();
    }, [broadcasterId, accessToken]);

    return { broadcasterInfo, loading, error };
};