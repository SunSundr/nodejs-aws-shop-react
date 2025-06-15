import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import { PopUp } from '~/components/utils/PopUp';
import { Order } from '~/models/Order';
import { useDeleteOrder, useInvalidateOrders, useOrders } from '~/queries/orders';
import { StyledTableCell } from '~/theme';

export default function Orders() {
  const { data, isLoading, error } = useOrders();
  // const navigate = useNavigate();
  const invalidateOrders = useInvalidateOrders();
  const { mutate: deleteOrder } = useDeleteOrder();
  const [orderConfirm, setOrderConfirm] = useState<{
    order?: Order;
    error?: Error;
    success?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) setOrderConfirm({ error });
  }, [error]);

  const deleteOrderHandler = async () => {
    if (!orderConfirm.order) return;
    setLoading(true);
    deleteOrder(orderConfirm.order.id, {
      onSuccess: () => {
        invalidateOrders();
        const delivery = orderConfirm.order?.delivery || {
          firstName: 'Unknown',
          lastName: 'User',
        };
        setOrderConfirm({
          success: `Order from ${delivery.firstName} ${delivery.lastName} successfully deleted.`,
        });
      },
      onError: (error) => setOrderConfirm({ error }),
      onSettled: () => {
        setLoading(false);
        setTimeout(() => setOrderConfirm({}), 6000);
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>From</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell align="center">Items count</StyledTableCell>
              <StyledTableCell align="center">Total</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((order) => (
              <TableRow key={order.id}>
                <StyledTableCell component="th" scope="row">
                  {order.delivery?.firstName} {order.delivery?.lastName}
                </StyledTableCell>
                <StyledTableCell>{order.delivery?.address}</StyledTableCell>
                <StyledTableCell align="center">{order.items?.length}</StyledTableCell>
                <StyledTableCell align="center">{order.total}</StyledTableCell>
                <StyledTableCell align="right">{order.currentStatus}</StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 8 }}
                  >
                    <Button size="small" color="primary" component={Link} to={order.id}>
                      {/* <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    > */}
                      Manage
                    </Button>
                    <Button size="small" color="warning" onClick={() => setOrderConfirm({ order })}>
                      Delete
                    </Button>
                  </div>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={Boolean(orderConfirm.order)}
        onClose={(_event, reason) => {
          if (reason == 'backdropClick') return;
          setOrderConfirm({});
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" color="error">
          Deleting an Order is irreversible!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            color={loading ? 'textDisabled' : 'primary'}
            id="alert-dialog-description"
          >
            If the Order status is APPROVED, the quantity of the products will be returned to the
            stock. Do you really want to delete the Order?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => setOrderConfirm({})}
            disabled={loading}
            sx={{ minWidth: 108 }}
            autoFocus
          >
            Disagree
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteOrderHandler}
            loading={loading}
            sx={{ minWidth: 108 }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <PopUp error={orderConfirm?.error} success={orderConfirm?.success} />
    </>
  );
}
