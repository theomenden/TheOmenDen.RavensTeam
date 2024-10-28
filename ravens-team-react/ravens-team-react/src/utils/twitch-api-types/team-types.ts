// Team member data structure based on Twitch API response
export interface TeamMember {
    id: string;
    users: TwitchUser[];
    background_image_url: string | null;
    banner: string | null;
    created_at: string;
    updated_at: string;
    info: string;
    thumbnail_url: string;
    team_name: string;
    team_display_name: string;
}

export interface TwitchUser {
    user_id: string;
    user_name: string;
    user_login: string;
}

// Response structure for team members
export interface TeamMembersResponse {
    data: Array<TeamMember>;
}

export interface TeamResponse {
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    background_image_url: string | null;
    banner: string | null;
    created_at: string;
    updated_at: string;
    info: string;
    thumbnail_url: string;
    team_name: string;
    team_display_name: string;
    id: string;
}

export interface TeamInfoResponse {
    data: TeamResponse[];
}

// Map of team members grouped by team ID
 export type TeamMembersByTeam = { [teamId: string]: TwitchUser[] };
