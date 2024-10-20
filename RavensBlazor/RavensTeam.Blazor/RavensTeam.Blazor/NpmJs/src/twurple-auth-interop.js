import { ExtensionAuthProvider } from "@twurple/auth-ext";
import { ApiClient } from '@twurple/api';

export async function getMyUserName() {
  const clientId = 'lalrvvljueuwdj1l778y6jcsuktevq';
  const authProvider = new ExtensionAuthProvider(clientId);
 
  const apiClient = new ApiClient({ authProvider });
  try {
    console.info('Fetching user name...');
    const user = await apiClient.users.getUserByName('aluthecrow');
    console.log('User name fetched:', user.displayName);
    return user.displayName;
  } catch (error) {
    console.error('Error fetching user name:', error);
    return null;    
  }
 
}
