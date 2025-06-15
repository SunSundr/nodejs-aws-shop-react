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
import PageEmailChange from '../pages/PageEmailChange/PageEmailChange';
import { PageLogin } from '../pages/PageLogin/PageLogin';
// import PageLoginTask8 from '../pages/PageLoginTask8/PageLoginTask8';
import { PageLogout } from '../pages/PageLogout/PageLogout';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import PageProfile from '../pages/PageProfile/PageProfile';
import PageSubscribe from '../pages/PageSubscribe/PageSubscribe';
import { PopUp } from '../utils/PopUp';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <LoadingSpinner offset={28} />;
  }
  // console.log(auth.user?.access_token);

  // if (auth.error?.message === 'Login required') {
  //   auth.error = undefined;
  //   auth.signinRedirect();
  // }

  // if (auth.error) {
  //   if (auth.error.message === 'No matching state found in storage') {
  //     auth.clearStaleState();
  //     auth.error = undefined;
  //   }
  // }

  return (
    <MainLayout>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<PageProducts />} />
        <Route path="/products" element={<Navigate to="/" replace />} />
        <Route path="/subscribe" element={<PageSubscribe />} />
        <Route path="/products/:id" element={<PageDetail />} />
        <Route path="cart" element={<PageCart />} />

        {/* temporary solution (task 8) */}
        {/* <Route path="signin" element={<PageLoginTask8 mode="login" />} /> */}
        {/* <Route path="signup" element={<PageLoginTask8 mode="register" />} /> */}

        {/* Protected pages */}
        <Route path="login" element={<PageLogin />} />
        <Route path="logout" element={<PageLogout />} />
        <Route path="profile" element={<PageProfile />} />
        <Route path="profile/email" element={<PageEmailChange />} />

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
      <PopUp error={auth.error} />
    </MainLayout>
  );
}

export default App;
