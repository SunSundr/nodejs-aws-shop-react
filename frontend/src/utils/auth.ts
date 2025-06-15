import { AuthContextProps } from 'react-oidc-context';
import { AUTH_SYNC_CHANNEL_NAME, AuthSyncMessage } from '~/constants/common';

type Headers = { [key: string]: string | undefined };

export const authHeaders = (auth: AuthContextProps, useXIdToken = true): Headers => {
  const headers: Headers = {
    'Content-Type': 'application/json',
  };
  if (auth.isAuthenticated) {
    headers.Authorization = `Bearer ${auth.user?.access_token}`;
    const profile = auth.user?.profile;
    if (useXIdToken && profile && (profile['custom:admin'] || profile['custom:manager'])) {
      headers['X-Id-Token'] = auth.user?.id_token;
    }
  }
  return headers;
};

let currentTabId: string;

export const getTabId = () => {
  if (!currentTabId) {
    currentTabId = Math.random().toString(36).substring(2, 10);
  }
  return currentTabId;
};

export const sendSyncAuthMessage = (
  params: { type: AuthSyncMessage } & Record<string, unknown>,
) => {
  setTimeout(() => {
    try {
      const channel = new BroadcastChannel(AUTH_SYNC_CHANNEL_NAME);
      channel.postMessage({
        ...params,
        tabId: getTabId(),
      });
      channel.close();
    } catch (error) {
      console.error('Broadcast failed:', error instanceof Error ? error.message : error);
    }
  });
};
