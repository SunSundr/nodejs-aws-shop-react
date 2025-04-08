import { useAuth } from 'react-oidc-context';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedLayout = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
