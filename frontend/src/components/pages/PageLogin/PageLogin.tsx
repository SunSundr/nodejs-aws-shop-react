import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { AuthSyncMessage, NEW_USER_MARK } from '~/constants/common';
import { sendSyncAuthMessage } from '~/utils/auth';

export const PageLogin = () => {
  const auth = useAuth();

  useEffect(() => {
    const newUser = sessionStorage.getItem(NEW_USER_MARK);
    if (newUser) {
      if (newUser === 'true') auth.signinRedirect();
      sessionStorage.removeItem(NEW_USER_MARK);
      sendSyncAuthMessage({ type: AuthSyncMessage.login, silent: newUser === 'false' });
    }
  }, [auth]);

  return <Navigate to="/" replace />;
};
