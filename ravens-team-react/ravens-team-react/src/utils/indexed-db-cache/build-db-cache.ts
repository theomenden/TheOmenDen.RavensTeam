import Axios from 'axios';
import { buildStorage, CacheRequestConfig, NotEmptyStorageValue, setupCache } from 'axios-cache-interceptor';
import { RavensTeamDb } from './db-instance';
export const buildIndexedDbCache = buildStorage({
    async find(key: string, currentRequest?: CacheRequestConfig) {
        const resolvedKey = currentRequest?.id ?? key;
        const cachedResponse = await RavensTeamDb.responseCache.get({cacheKeyId:resolvedKey});
        if (!cachedResponse) {
            return;
        }
        return JSON.parse(cachedResponse.data);
    },
    async set(key: string, value: NotEmptyStorageValue, currentRequest? : CacheRequestConfig) {
       const resolvedKey = currentRequest?.id?? key;
       await RavensTeamDb.responseCache.put({cacheKeyId:resolvedKey, data: JSON.stringify(value)});
    },
    async remove(key: string, currentRequest?: CacheRequestConfig) {
        const resolvedKey = currentRequest?.id?? key;
        await RavensTeamDb.responseCache.delete(resolvedKey);
    },
    async clear() {
      await RavensTeamDb.responseCache.clear();  
    },
});