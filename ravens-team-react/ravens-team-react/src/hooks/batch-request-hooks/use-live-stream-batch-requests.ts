import { chunkUserIdsIntoBatchesOf, createUserIdQueryString } from './../../utils/user-query-string-helpers';
import React from 'react';
import { getCurrentlyLiveStreams } from '../../utils/twitchApi';
import { useQuery } from '../../utils/axios-instance';
import { StreamData, StreamDataResponse } from '../../utils/twitch-api-types/stream-types';

interface LiveStreamBatchRequestProps {
    batchSize: number;
    userIds: string[];
}


export const useLiveStreamBatchRequest = ({ batchSize, userIds }: LiveStreamBatchRequestProps) => {
    const [streams, setStreams] = React.useState<StreamData[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Error | null>(null);
    const [offset, setOffset] = React.useState<number>(0);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const [totalStreams, setTotalStreams] = React.useState<number>(0);

    const fetchCurrentLiveStreams = React.useEffect(() => {
        setLoading(true);
        setError(null);
        const liveStreamRequestDataPromises: Promise<number | void>[] = [];
        const liveStreams: StreamData[] = [];
        const chunkedUserIds = chunkUserIdsIntoBatchesOf(userIds, batchSize);
        
        for (let i = 0; i < chunkedUserIds.length; i++) {
            const response = getCurrentlyLiveStreams(chunkedUserIds[i])
                .then(response => response.data)
                .then(data => liveStreams.push(...data))
                .catch(err => setError(err))
                .finally(() => setLoading(false));
            liveStreamRequestDataPromises.push(response);
        }

        const resolveStreamDataPromises = async () => await Promise.allSettled(liveStreamRequestDataPromises);
        
        try {
            resolveStreamDataPromises();
            setTotalStreams(liveStreams.length);
            setHasMore(liveStreams.length < totalStreams);
            setOffset(offset + batchSize);
            setStreams([...liveStreams]);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }, [batchSize]);

}