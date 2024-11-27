// src/twitch.d.ts

interface TwitchAuth {
    channelId: string;
    token: string;
    helixToken: string;
    clientId: string;
    userId?: string;
}

interface TwitchExt {
    onAuthorized: (callback: (auth: TwitchAuth) => void) => void;
    viewer: {
        sessionToken: string;
    };
    actions: {
        followChannel: (channelName: string) => void;
        onFollowed: (callback: (didFollow: boolean, channelName: string) => Function) => void;
    };
}

interface Window {
    Twitch?: {
        ext: TwitchExt;
    };
}
