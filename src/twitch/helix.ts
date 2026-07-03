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
  const res = await fetch(url, { headers: authHeaders(auth) });
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
