// src/hooks/useTwitchAuth.ts
import { useState, useEffect } from 'react';

interface TwitchAuthData {
    broadcasterId: string | null;
    authToken: string | null;
    loading: boolean;
    error: string | null;
}

export const useTwitchAuth = (): TwitchAuthData => {
    const [broadcasterId, setBroadcasterId] = useState<string | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if Twitch extension helper is available
        if (window.Twitch && window.Twitch.ext) {
            window.Twitch.ext.onAuthorized((auth) => {
                setAuthToken(auth.token);
                setBroadcasterId(auth.channelId);
                setLoading(false);
            });
        } else {
            setError("Twitch extension helper is not available.");
            setLoading(false);
        }
    }, []);

    return { broadcasterId, authToken, loading, error };
};
