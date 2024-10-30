export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string | null;
    created_at: string;
}

export interface TwitchUserResponse {
    data: TwitchUser[];
}

export interface TwitchBroadcasterInfo {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    broadcaster_language: string;
    game_id: string;
    game_name: string;
    title: string;
    delay: number;
    tags: string[];
    content_classification_labels: string[];
    is_branded_content: boolean;
}

export interface TwitchBroadcasterResponse {
    data: TwitchBroadcasterInfo[];
}