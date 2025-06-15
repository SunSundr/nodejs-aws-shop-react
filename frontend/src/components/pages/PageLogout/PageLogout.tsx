import { Navigate } from 'react-router-dom';
import { AuthSyncMessage, LOGOUT_USER_MARK } from '~/constants/common';
import { sendSyncAuthMessage } from '~/utils/auth';

export const PageLogout = () => {
  const removeUser = sessionStorage.getItem(LOGOUT_USER_MARK);
  if (removeUser) {
    sessionStorage.removeItem(LOGOUT_USER_MARK);
    sendSyncAuthMessage({ type: AuthSyncMessage.logout });
  }

  return <Navigate to="/" replace />;
};
