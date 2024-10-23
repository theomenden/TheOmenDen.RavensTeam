import { Axios } from 'axios';
import wrapper from 'axios-cache-plugin';



class TwitchApi {
  static _axiosInstance;
  constructor() { }

  static getInstance() {
    if (!this.instance) {
      const baseAxios = Axios.create({
        baseURL: 'https://api.twitch.tv/helix',
        headers: {
          'client-id': 'lalrvvljueuwdj1l778y6jcsuktevq',
          'Authorization': `Extension ${getAuthHelixToken()}`
        },
        timeout: 10000
      });


      const axiosWrapper = wrapper(baseAxios, {
        maxCacheSize: 15
      });
      this._axiosInstance = axiosWrapper;
    }
    return this.instance;
  }
  getAuthHelixToken() {
    let authResponse;
    if (window.Twitch && window.Twitch.ext) {
      window.Twitch.ext.onAuthorized(function (auth) {
        authResponse = auth;
      });
    }
    return authResponse?.helixToken;
  }
}

const cachedTwitchApi = TwitchApi.getInstance();

export default cachedTwitchApi;
