import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik, FormikProps } from 'formik';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TextField from '~/components/Form/TextField';
import { GoBackButton } from '~/components/GoBackButton/GoBackButton';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ReviewOrder from '~/components/pages/PageCart/components/ReviewOrder';
import PaperLayout from '~/components/PaperLayout/PaperLayout';
import { ORDER_STATUS_FLOW, OrderStatus } from '~/constants/order';
import { CartItem } from '~/models/CartItem';
import { OrderItem } from '~/models/Order';
import { useOrder, useUpdateOrderStatus } from '~/queries/orders';
import { getErrorProduct, useAvailableProducts } from '~/queries/products';

type FormValues = {
  status: OrderStatus;
  comment: string;
};

export default function PageOrder() {
  // const auth = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const location = useLocation();
  // const results = useQueries({
  //   queries: [
  //     {
  //       queryKey: ['order', { id }],
  //       queryFn: async () => {
  //         if (location.state?.order) return location.state.order as Order;
  //         const res = await axios.get<Order>(`${API_PATHS.order}/order/${id}`, {
  //           headers: authHeaders(auth),
  //         });
  //         return res.data;
  //       },
  //     },
  //     {
  //       queryKey: ['available-products'],
  //       queryFn: async () => {
  //         const res = await axios.get<AvailableProduct[]>(`${API_PATHS.product}/products`);
  //         return res.data;
  //       },
  //     },
  //   ],
  // });

  // const [
  //   { data: order, isLoading: isOrderLoading },
  //   { data: products, isLoading: isProductsLoading },
  // ] = results;

  const [
    { data: order, isLoading: isOrderLoading },
    { data: products, isLoading: isProductsLoading },
  ] = [useOrder(id), useAvailableProducts()];

  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
  const cartItems: CartItem[] = useMemo(() => {
    if (order && products) {
      return order.items.map((item: OrderItem) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          console.error('Product not found');
          return { product: getErrorProduct(item.productId), count: 0 };
        }
        return { product, count: item.count };
      });
    }
    return [];
  }, [order, products]);

  if (isOrderLoading || isProductsLoading) return <LoadingSpinner />;

  const statusHistory = order?.statusHistory || [];

  const lastStatusItem = statusHistory[statusHistory.length - 1];

  return order ? (
    <PaperLayout>
      <div style={{ position: 'absolute', transform: 'translate(0, -10px)' }}>
        <GoBackButton navigate="/admin/orders" />{' '}
      </div>
      <Typography component="h2" variant="h4" align="center">
        Manage Order
      </Typography>
      <Divider sx={{ mb: 2, mt: 1 }} />
      <ReviewOrder address={order.delivery} items={cartItems} />
      <Typography variant="h6">Status:</Typography>
      <Typography
        variant="h6"
        color={order.currentStatus === OrderStatus.CANCELLED ? 'error' : 'primary'}
      >
        {order.currentStatus.toUpperCase()}
      </Typography>
      <Typography variant="h6">Change status:</Typography>
      <Box py={2}>
        <Formik
          initialValues={{ status: lastStatusItem.status, comment: '' }}
          enableReinitialize
          onSubmit={(values) => {
            updateOrderStatus({ id: order.id, ...values }).finally(() => navigate('/admin/orders'));
          }}
        >
          {({ values, dirty, isSubmitting }: FormikProps<FormValues>) => (
            <Form autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="status"
                    label="Status"
                    select
                    fullWidth
                    helperText={
                      values.status === OrderStatus.APPROVED
                        ? 'Setting status to APPROVED will decrease products count from stock'
                        : undefined
                    }
                  >
                    {ORDER_STATUS_FLOW.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    name="comment"
                    label="Comment"
                    fullWidth
                    autoComplete="off"
                    multiline
                  />
                </Grid>
                <Grid item container xs={12} justifyContent="space-between">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!dirty || isSubmitting}
                    loading={isSubmitting}
                  >
                    Change status
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
      <Typography variant="h6">Status history:</Typography>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell align="right">Date and Time</TableCell>
              <TableCell align="right">Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusHistory.map((statusHistoryItem, index) => (
              <TableRow key={`${index}`}>
                <TableCell component="th" scope="row">
                  {statusHistoryItem.status.toUpperCase()}
                </TableCell>
                <TableCell align="right">
                  {new Date(statusHistoryItem.timestamp * 1000).toLocaleString(
                    navigator.languages[0],
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  )}
                </TableCell>
                <TableCell align="right">{statusHistoryItem.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PaperLayout>
  ) : null;
}
