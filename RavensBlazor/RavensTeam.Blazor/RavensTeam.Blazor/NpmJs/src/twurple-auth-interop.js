import { ExtensionAuthProvider } from "@twurple/auth-ext";
import { ApiClient } from '@twurple/api';

export function callTwitchAuthHelper() {
    window.Twitch.ext.onAuthorized(auth => {
    console.log('Auth object:', JSON.stringify(auth) + '\n');
    });
}

export async function getMyUserName() {
  try {    
    const clientId = 'lalrvvljueuwdj1l778y6jcsuktevq';
    const authProvider = new ExtensionAuthProvider(clientId);
    console.info('Fetching user name...');
    const apiClient = new ApiClient({ authProvider });
    const user = await apiClient.users.getUserByName('aluthecrow');
    console.log('User name fetched:', user.displayName);
    return user.displayName;
 
  } catch (error) {
    console.error('Error fetching user name:', error);
    return null;    
  }
 
}
