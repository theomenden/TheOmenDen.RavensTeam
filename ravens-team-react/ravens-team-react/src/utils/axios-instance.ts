// src/services/axiosInstance.ts
import Axios from 'axios';
import { buildWebStorage, CacheOptions, setupCache } from 'axios-cache-interceptor';
import { createAxiosCacheHooks } from 'axios-cache-hooks';
import { buildIndexedDbCache } from './indexed-db-cache/build-db-cache';
const axiosInstance = Axios.create({
    baseURL: 'https://api.twitch.tv/helix',
    headers: {
        'client-id': 'lalrvvljueuwdj1l778y6jcsuktevq',
    },
    timeout: 5000, // 5-second timeout for requests
});

// const axiosCacheOptions: CacheOptions = {
//     storage: buildWebStorage(window.localStorage, 'axios-cache:'),
//     cacheTakeover: false // Cache will not takeover when a new request is made
// };

const axiosCacheOptions: CacheOptions = {
    storage: buildIndexedDbCache,
    cacheTakeover: false, // Cache will not takeover when a new request is made
};

const axios = setupCache(axiosInstance, axiosCacheOptions);

axios.interceptors.response.use(
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
axios.interceptors.request.use(
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

export default axios;
export const { useQuery, useMutation } = createAxiosCacheHooks();
// export default axiosInstance;
// Uncomment this line to expose the axios instance for testing purposes