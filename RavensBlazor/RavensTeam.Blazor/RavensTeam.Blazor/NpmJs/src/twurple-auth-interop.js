import { ExtensionAuthProvider } from "@twurple/auth-ext";
import { ApiClient } from '@twurple/api';

export function getAuthResponse() {
  let authResponse = '';
  if (window.Twitch && window.Twitch.ext) {
    window.Twitch.ext.onAuthorized(function (auth) {
      authResponse = JSON.stringify(auth);
    });
  }
  return authResponse;
}

export function getTwitchConfiguration() {
  let config = '';

  if (window.Twitch && window.Twitch.ext) {
    config = JSON.stringify(window.Twitch.ext);
  }
  return config;
}
