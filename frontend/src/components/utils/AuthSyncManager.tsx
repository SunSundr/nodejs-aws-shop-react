import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from 'react-oidc-context';
import { AUTH_SYNC_CHANNEL_NAME, AuthSyncMessage } from '../../constants/common';
import { CartItem } from '../../models/CartItem';
import { useInvalidateCart } from '../../queries/cart';
import { getTabId } from '../../utils/auth';

export default function AuthSyncManager() {
  const invalidateCart = useInvalidateCart();
  const auth = useAuth();
  const currentTabId = useRef(getTabId());

  const handleCartInvalidation = useCallback(
    (data?: CartItem[]) => {
      if (data) invalidateCart(data);
    },
    [invalidateCart],
  );

  useEffect(() => {
    const channel = new BroadcastChannel(AUTH_SYNC_CHANNEL_NAME);

    const handleChannelMessage = (event: MessageEvent) => {
      if (event.data.tabId === currentTabId.current) return;

      switch (event.data.type) {
        case AuthSyncMessage.cart:
          handleCartInvalidation(event.data.data);
          break;
        case AuthSyncMessage.products:
          break;
        case AuthSyncMessage.orders:
          break;
        case AuthSyncMessage.login:
          if (!auth.isAuthenticated) {
            if (event.data.silent) {
              auth.signinSilent();
            } else {
              auth.signinRedirect();
            }
          }
          break;
        case AuthSyncMessage.logout:
          auth.removeUser();
          handleCartInvalidation([]);
          break;
        case AuthSyncMessage.profile:
          auth.signinSilent();
          break;
      }
    };

    channel.addEventListener('message', handleChannelMessage);

    return () => {
      channel.removeEventListener('message', handleChannelMessage);
      channel.close();
    };
  }, [auth, handleCartInvalidation]);

  return null;
}
