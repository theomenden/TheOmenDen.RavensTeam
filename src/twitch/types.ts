/**
 * Domain models and Twitch Helix wire shapes for Raven's Team.
 *
 * Branded id types stop a {@link UserId}, {@link TeamId}, and a plain login from being
 * used interchangeably — the compiler rejects the mix-up even though all are strings.
 *
 * @packageDocumentation
 */

/** Nominal-branding helper: `Brand<string, 'UserId'>` only unifies with itself. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/** Opaque Twitch user id (a numeric string). */
export type UserId = Brand<string, 'UserId'>;

/** Opaque Twitch team id. */
export type TeamId = Brand<string, 'TeamId'>;

/** Narrows a raw string to a {@link UserId} at a trust boundary (Helix response). */
export const asUserId = (value: string): UserId => value as UserId;

/** Narrows a raw string to a {@link TeamId} at a trust boundary (Helix response). */
export const asTeamId = (value: string): TeamId => value as TeamId;

/** The auth fields the panel needs, derived from `Twitch.ext.onAuthorized`. */
export interface TwitchAuth {
  readonly channelId: string;
  readonly clientId: string;
  readonly helixToken: string;
}

/** A team member as rendered in the roster. */
export interface TeamMember {
  readonly userId: UserId;
  readonly login: string;
  readonly displayName: string;
  /** Profile image URL, or `null` when it could not be resolved. */
  readonly avatarUrl: string | null;
}

/** A team the broadcaster belongs to, with its members. */
export interface Team {
  readonly id: TeamId;
  /** Slug used in `twitch.tv/team/<name>`. */
  readonly name: string;
  readonly displayName: string;
  readonly bannerUrl: string | null;
  readonly members: readonly TeamMember[];
}

/** A team's tab-level header — branding only, cheap to load for every team up front. */
export interface TeamHeader {
  readonly id: TeamId;
  /** Slug used in `twitch.tv/team/<name>`. */
  readonly name: string;
  readonly displayName: string;
  readonly bannerUrl: string | null;
}

/** Lifecycle of the team-headers fetch (drives the tabs). */
export type TeamsState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: Error }
  | { readonly status: 'ready'; readonly teams: readonly TeamHeader[] };

/** Lifecycle of a single team's member-list fetch (lazy, per active tab). */
export type MembersState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: Error }
  | { readonly status: 'ready'; readonly members: readonly TeamMember[] };

// --- Raw Helix response shapes (only the fields we read) ---

/** Envelope shared by Helix list endpoints. */
export interface HelixList<T> {
  readonly data: readonly T[];
}

/** Element of `GET /helix/teams/channel`. */
export interface RawChannelTeam {
  readonly id: string;
  readonly team_name: string;
  readonly team_display_name: string;
  readonly banner: string | null;
}

/** Member entry inside `GET /helix/teams`. */
export interface RawTeamUser {
  readonly user_id: string;
  readonly user_login: string;
  readonly user_name: string;
}

/** Element of `GET /helix/teams`. */
export interface RawTeam {
  readonly id: string;
  readonly team_name: string;
  readonly team_display_name: string;
  readonly banner: string | null;
  readonly users: readonly RawTeamUser[];
}

/** Element of `GET /helix/users`. */
export interface RawUser {
  readonly id: string;
  readonly login: string;
  readonly display_name: string;
  readonly profile_image_url: string;
}

/** Element of `GET /helix/streams` (presence with `type: 'live'` ⇒ live). */
export interface RawStream {
  readonly user_id: string;
  readonly type: string;
}
