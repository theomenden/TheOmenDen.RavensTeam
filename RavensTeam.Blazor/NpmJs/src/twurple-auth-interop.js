import cachedTwitchApi from './TwitchApi';

export function getAuthResponse() {
  let authResponse;
  if (window.Twitch && window.Twitch.ext) {
    window.Twitch.ext.onAuthorized(function (auth) {
      authResponse = JSON.stringify(auth);
    });
  }
  return authResponse;
}

export async function getChannelInfo(broadcasterId) {
  cachedTwitchApi.get(`/channels?broadcaster_id=${broadcasterId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
}
export async function getChannelTeams(broadcasterId) {
  cachedTwitchApi.get(`/teams/channel?broadcaster_id=${broadcasterId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
}

export async function getTeamDetails(teamId) {
  cachedTwitchApi.get(`/teams?id=${teamId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
}
