import {Entity} from 'dexie';
import type RavensTeamCacheDb from './ravens-team-cache-db';
export default class RavensTeamResponse {
    cacheKeyId!: string;
    data!: string;
}