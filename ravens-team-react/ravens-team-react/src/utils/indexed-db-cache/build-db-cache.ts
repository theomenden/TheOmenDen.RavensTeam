import { buildStorage, CacheRequestConfig, NotEmptyStorageValue } from 'axios-cache-interceptor';
import { RavensTeamDb } from './db-instance';
export const buildIndexedDbCache = buildStorage({
    async find(key: string, currentRequest?: CacheRequestConfig) {
        const resolvedKey = currentRequest?.id ?? key;
        const cachedResponse = await RavensTeamDb.transaction('r', RavensTeamDb.responseCache, async () => {
            const responseData = await RavensTeamDb.responseCache.get({ cacheKeyId: resolvedKey });
            if (!responseData) {
                return;
            }
            return JSON.parse(responseData.data);
        });

        return cachedResponse;
    },
    async set(key: string, value: NotEmptyStorageValue, currentRequest?: CacheRequestConfig) {
        const resolvedKey = currentRequest?.id ?? key;

        await RavensTeamDb.transaction('rw', RavensTeamDb.responseCache, async () => {

            await RavensTeamDb.responseCache.put({ cacheKeyId: resolvedKey, data: JSON.stringify(value) });
        });
    },
    async remove(key: string, currentRequest?: CacheRequestConfig) {
        const resolvedKey = currentRequest?.id ?? key;
        await RavensTeamDb.transaction('rw', RavensTeamDb.responseCache, async () => {
            await RavensTeamDb.responseCache.delete(resolvedKey);
        });
    },
    async clear() {
        await RavensTeamDb.transaction('rw', RavensTeamDb.responseCache, async () => {
            await RavensTeamDb.responseCache.clear();
        });
    },
});