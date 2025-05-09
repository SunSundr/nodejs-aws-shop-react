import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { Field, Form, Formik, FormikProps } from 'formik';
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
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ReviewOrder from '~/components/pages/PageCart/components/ReviewOrder';
import PaperLayout from '~/components/PaperLayout/PaperLayout';
import API_PATHS from '~/constants/apiPaths';
import { ORDER_STATUS_FLOW, OrderStatus } from '~/constants/order';
import { CartItem } from '~/models/CartItem';
import { Order, OrderItem } from '~/models/Order';
import { AvailableProduct } from '~/models/Product';
import { useInvalidateOrder, useUpdateOrderStatus } from '~/queries/orders';
import { getErrorProduct } from '~/queries/products';

type FormValues = {
  status: OrderStatus;
  comment: string;
};

export default function PageOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const results = useQueries({
    queries: [
      {
        queryKey: ['order', { id }],
        queryFn: async () => {
          const res = await axios.get<Order>(`${API_PATHS.orderMock}/order/${id}`);
          return res.data;
        },
      },
      {
        queryKey: ['products'],
        queryFn: async () => {
          const res = await axios.get<AvailableProduct[]>(`${API_PATHS.bff}/products`);
          return res.data;
        },
      },
    ],
  });
  const [
    { data: order, isLoading: isOrderLoading },
    { data: products, isLoading: isProductsLoading },
  ] = results;
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
  const invalidateOrder = useInvalidateOrder();
  const cartItems: CartItem[] = React.useMemo(() => {
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
      <Typography component="h2" variant="h4" align="center">
        Manage order{' '}
        <span style={{ fontSize: 14 }}>
          <i>(mock data)</i>
        </span>
      </Typography>
      <ReviewOrder address={order.address} items={cartItems} />
      <Typography variant="h6">Status:</Typography>
      <Typography variant="h6" color="primary">
        {lastStatusItem?.status.toUpperCase()}
      </Typography>
      <Typography variant="h6">Change status:</Typography>
      <Box py={2}>
        <Formik
          initialValues={{ status: lastStatusItem.status, comment: '' }}
          enableReinitialize
          onSubmit={(values) => {
            console.warn('Changing the status of the mock data could not be completed');
            updateOrderStatus(
              { id: order.id, ...values },
              { onSuccess: () => invalidateOrder(order.id) },
            ).finally(() => navigate('/admin/orders'));
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
                      values.status === OrderStatus.Approved
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
            {statusHistory.map((statusHistoryItem) => (
              <TableRow key={order.id}>
                <TableCell component="th" scope="row">
                  {statusHistoryItem.status.toUpperCase()}
                </TableCell>
                <TableCell align="right">
                  {new Date(statusHistoryItem.timestamp).toString()}
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
