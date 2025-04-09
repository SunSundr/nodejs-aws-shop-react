import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDeleteOrder, useInvalidateOrders, useOrders } from '~/queries/orders';
import { StyledTableCell } from '~/theme';

export default function Orders() {
  const { data } = useOrders();
  const invalidateOrders = useInvalidateOrders();
  const { mutate: deleteOrder } = useDeleteOrder();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>From</StyledTableCell>
            <StyledTableCell align="right">Items count</StyledTableCell>
            <StyledTableCell align="right">Address</StyledTableCell>
            <StyledTableCell align="right">Status</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((order) => (
            <TableRow key={order.id}>
              <StyledTableCell component="th" scope="row">
                {order.address?.firstName} {order.address?.lastName}
              </StyledTableCell>
              <StyledTableCell align="right">{order.items.length}</StyledTableCell>
              <StyledTableCell align="right">{order.address?.address}</StyledTableCell>
              <StyledTableCell align="right">
                {order.statusHistory[order.statusHistory.length - 1].status}
              </StyledTableCell>
              <StyledTableCell align="right">
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 8 }}
                >
                  <Button size="small" color="primary" component={Link} to={order.id}>
                    Manage
                  </Button>
                  <Button
                    size="small"
                    color="warning"
                    onClick={() => {
                      console.warn('Deletion of mock data could not be completed');
                      deleteOrder(order.id, { onSuccess: invalidateOrders });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
