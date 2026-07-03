import {
  asTeamId,
  asUserId,
  type HelixList,
  type RawChannelTeam,
  type RawStream,
  type RawTeam,
  type RawUser,
  type Team,
  type TeamMember,
  type TwitchAuth,
  type UserId,
} from './types';

const HELIX_BASE = 'https://api.twitch.tv/helix';

/** Maximum ids Helix accepts per `users`/`streams` request. */
export const HELIX_BATCH_LIMIT = 100;

/** A single repeated query parameter, e.g. `['user_id', '123']`. */
type QueryParam = readonly [key: string, value: string];

const authHeaders = (auth: TwitchAuth): HeadersInit => ({
  'Client-Id': auth.clientId,
  Authorization: `Extension ${auth.helixToken}`,
});

// --- Rate-limit guard --------------------------------------------------------
// Helix shares one token bucket per extension client id. A large roster fans out into dozens
// of users/streams batches; firing them all at once (Promise.all in the hooks) bursts past the
// limit → 429. Cap concurrency and retry 429s here so every caller that routes through
// helixGet stays polite without needing its own throttle.

/** Max Helix requests in flight at once. */
const MAX_CONCURRENT = 4;
/** Retries after an initial 429 before surfacing the error. */
const MAX_RETRIES = 4;

let inFlight = 0;
const waiters: Array<() => void> = [];

const acquireSlot = (): Promise<void> =>
  new Promise((resolve) => {
    if (inFlight < MAX_CONCURRENT) {
      inFlight += 1;
      resolve();
    } else {
      waiters.push(resolve);
    }
  });

const releaseSlot = (): void => {
  const next = waiters.shift();
  // Hand the freed slot straight to the next waiter; inFlight only drops when none are waiting.
  if (next) next();
  else inFlight -= 1;
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Delay (ms) to wait after a 429, preferring Helix's `Ratelimit-Reset` (unix seconds) or
 * `Retry-After` (seconds), else exponential backoff with jitter. Capped so a stuck header
 * can't hang the panel.
 */
export const retryDelayMs = (res: Response, attempt: number): number => {
  const reset = res.headers.get('ratelimit-reset');
  if (reset) {
    const untilMs = Number(reset) * 1000 - Date.now();
    if (Number.isFinite(untilMs) && untilMs > 0) return Math.min(untilMs, 10_000);
  }
  const retryAfter = Number(res.headers.get('retry-after'));
  if (Number.isFinite(retryAfter) && retryAfter > 0) return Math.min(retryAfter * 1000, 10_000);
  return Math.min(500 * 2 ** attempt, 8_000) + Math.random() * 250;
};

/** `fetch` behind a concurrency cap + 429 retry. The backoff wait is held outside a slot. */
const helixFetch = async (url: string, headers: HeadersInit): Promise<Response> => {
  for (let attempt = 0; ; attempt += 1) {
    await acquireSlot();
    let res: Response;
    try {
      res = await fetch(url, { headers });
    } finally {
      releaseSlot();
    }
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;
    await sleep(retryDelayMs(res, attempt));
  }
};

/**
 * Performs a typed GET against Helix. Repeated params (e.g. many `user_id`s) are expressed
 * by passing multiple entries for the same key.
 *
 * @typeParam T - element type of the Helix `data` array.
 * @throws Error when the response status is not OK.
 */
const helixGet = async <T>(
  path: string,
  params: readonly QueryParam[],
  auth: TwitchAuth,
): Promise<HelixList<T>> => {
  const query = new URLSearchParams(params.map(([k, v]) => [k, v])).toString();
  const url = query ? `${HELIX_BASE}${path}?${query}` : `${HELIX_BASE}${path}`;
  const res = await helixFetch(url, authHeaders(auth));
  if (!res.ok) {
    throw new Error(`Helix ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as HelixList<T>;
};

/** Fetches the teams a broadcaster belongs to (id + branding, no members). */
export const getChannelTeams = async (
  auth: TwitchAuth,
  broadcasterId: string,
): Promise<readonly RawChannelTeam[]> => {
  const { data } = await helixGet<RawChannelTeam>(
    '/teams/channel',
    [['broadcaster_id', broadcasterId]],
    auth,
  );
  return data;
};

/** Fetches a single team's details (including members) and maps it to a {@link Team}. */
export const getTeam = async (auth: TwitchAuth, teamId: string): Promise<Team | null> => {
  const { data } = await helixGet<RawTeam>('/teams', [['id', teamId]], auth);
  const raw = data[0];
  if (!raw) return null;
  const members: readonly TeamMember[] = raw.users.map((u) => ({
    userId: asUserId(u.user_id),
    login: u.user_login,
    displayName: u.user_name,
    avatarUrl: null,
  }));
  return {
    id: asTeamId(raw.id),
    name: raw.team_name,
    displayName: raw.team_display_name,
    bannerUrl: raw.banner,
    members,
  };
};

/**
 * Fetches profile info for up to {@link HELIX_BATCH_LIMIT} users, returning a map of
 * user id → avatar URL. The caller batches larger id sets.
 */
export const getUserAvatars = async (
  auth: TwitchAuth,
  ids: readonly UserId[],
): Promise<ReadonlyMap<UserId, string>> => {
  if (ids.length === 0) return new Map();
  const { data } = await helixGet<RawUser>('/users', ids.map((id) => ['id', id]), auth);
  return new Map(data.map((u) => [asUserId(u.id), u.profile_image_url]));
};

/**
 * Fetches live status for up to {@link HELIX_BATCH_LIMIT} users, returning the set of ids
 * currently live. The caller batches larger id sets.
 */
export const getLiveUserIds = async (
  auth: TwitchAuth,
  ids: readonly UserId[],
): Promise<ReadonlySet<UserId>> => {
  if (ids.length === 0) return new Set();
  const { data } = await helixGet<RawStream>('/streams', ids.map((id) => ['user_id', id]), auth);
  return new Set(data.filter((s) => s.type === 'live').map((s) => asUserId(s.user_id)));
};
