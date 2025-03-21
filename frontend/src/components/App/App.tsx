import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '~/components/MainLayout/MainLayout';
import PageProductImport from '~/components/pages/admin/PageProductImport/PageProductImport';
import PageCart from '~/components/pages/PageCart/PageCart';
import PageOrder from '~/components/pages/PageOrder/PageOrder';
import PageOrders from '~/components/pages/PageOrders/PageOrders';
import PageProductForm from '~/components/pages/PageProductForm/PageProductForm';
import PageProducts from '~/components/pages/PageProducts/PageProducts';
import PageDetail from '../pages/PageDetail/PageDetail';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import PageSubscribe from '../pages/PageSubscribe/PageSubscribe';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<PageProducts />} />
        <Route path="/products" element={<Navigate to="/" replace />} />
        <Route path="/subscribe" element={<PageSubscribe />} />
        <Route path="/products/:id" element={<PageDetail />} />
        <Route path="cart" element={<PageCart />} />
        <Route path="admin/orders">
          <Route index element={<PageOrders />} />
          <Route path=":id" element={<PageOrder />} />
        </Route>
        <Route path="admin/products" element={<PageProductImport />} />
        <Route path="admin/product-form">
          <Route index element={<PageProductForm />} />
          <Route path=":id" element={<PageProductForm />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
