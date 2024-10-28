// src/services/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.twitch.tv/helix',
    headers: {
        'client-id': 'lalrvvljueuwdj1l778y6jcsuktevq',
    },
    timeout: 5000, // 5-second timeout for requests
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            return response;
        } else {
            console.error("Non-200 status code:", response.statusText);
            return Promise.reject(new Error(response.statusText));
        }
    },
    (error) => {
        console.error("API Request Error:", error.message);
        return Promise.reject(error);
    }
);

// Request interceptor to add the authorization header with the latest token
axiosInstance.interceptors.request.use(
    async (config) => {
        // Retrieve the token from the Twitch extension-helper script
        const token = await getTwitchAuthToken();
        if (token) {
            config.headers['Authorization'] = `Extension ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Helper function to get the Twitch authentication token
const getTwitchAuthToken = async (): Promise<string | null> => {
    return new Promise((resolve) => {
        // Ensure window.Twitch.ext is available before accessing the token
        if (window.Twitch && window.Twitch.ext) {
            window.Twitch.ext.onAuthorized((auth) => {
                resolve(auth.helixToken);
            });
        } else {
            console.error("Twitch extension helper is not available.");
            resolve(null);
        }
    });
};

export default axiosInstance;
