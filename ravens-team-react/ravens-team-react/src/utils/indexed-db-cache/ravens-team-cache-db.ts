import Dexie, {type Table} from 'dexie';
import RavensTeamResponse from './cached-response';

export default class RavensTeamCacheDb extends Dexie {
    responseCache!: Table<RavensTeamResponse, string>;

    constructor() {
        super('RavensTeamCache');
        this.version(1).stores({
            responseCache: 'cacheKeyId'
        });
        this.responseCache.mapToClass(RavensTeamResponse);
    }
}