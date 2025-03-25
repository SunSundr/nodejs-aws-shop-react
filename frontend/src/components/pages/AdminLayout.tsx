import { useAuth } from 'react-oidc-context';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  const auth = useAuth();
  const isAdmin = auth?.user?.profile['custom:admin'];

  if (auth.isAuthenticated && isAdmin) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
