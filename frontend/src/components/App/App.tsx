import { useAuth } from 'react-oidc-context';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '~/components/MainLayout/MainLayout';
import PageProductImport from '~/components/pages/admin/PageProductImport/PageProductImport';
import PageCart from '~/components/pages/PageCart/PageCart';
import PageOrder from '~/components/pages/PageOrder/PageOrder';
import PageOrders from '~/components/pages/PageOrders/PageOrders';
import PageProductForm from '~/components/pages/PageProductForm/PageProductForm';
import PageProducts from '~/components/pages/PageProducts/PageProducts';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { AdminLayout } from '../pages/AdminLayout';
import PageDetail from '../pages/PageDetail/PageDetail';
import { PageLogin } from '../pages/PageLogin/PageLogin';
import { PageLogout } from '../pages/PageLogout/PageLogout';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import PageSubscribe from '../pages/PageSubscribe/PageSubscribe';
import { ProtectedLayout } from '../pages/ProtectedLayout';

function App() {
  const auth = useAuth();
  const removeUser = localStorage.getItem('removeUser');
  if (removeUser) {
    localStorage.removeItem('removeUser');
    auth.removeUser();
  }

  if (auth.isLoading) {
    return <LoadingSpinner offset={28} />;
  }

  if (auth.error) {
    if (auth.error.message === 'No matching state found in storage') {
      auth.clearStaleState();
      auth.error = undefined;
    } else {
      return <div>Encountering error... {auth.error.message}</div>;
    }
  }

  return (
    <MainLayout>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PageProducts />} />
        <Route path="/products" element={<Navigate to="/" replace />} />
        <Route path="/subscribe" element={<PageSubscribe />} />
        <Route path="/products/:id" element={<PageDetail />} />
        {/* Protected pages */}
        <Route element={<ProtectedLayout />}>
          <Route path="cart" element={<PageCart />} />
          <Route path="login" element={<PageLogin />} />
          <Route path="logout" element={<PageLogout />} />
        </Route>
        {/* Admin pages */}
        <Route element={<AdminLayout />}>
          <Route path="admin/orders">
            <Route index element={<PageOrders />} />
            <Route path=":id" element={<PageOrder />} />
          </Route>
          <Route path="admin/products" element={<PageProductImport />} />
          <Route path="admin/product-form">
            <Route index element={<PageProductForm />} />
            <Route path=":id" element={<PageProductForm />} />
          </Route>
        </Route>
        {/* Catch all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
