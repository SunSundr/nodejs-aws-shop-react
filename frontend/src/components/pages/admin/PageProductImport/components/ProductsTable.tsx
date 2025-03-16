import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  useAvailableProducts,
  useDeleteAvailableProduct,
  useInvalidateAvailableProducts,
} from '~/queries/products';
import { StyledTableCell } from '~/theme';
import { formatAsPrice, sortProductsById } from '~/utils/utils';

export default function ProductsTable() {
  const { data = [] } = useAvailableProducts();
  const { mutate: deleteAvailableProduct } = useDeleteAvailableProduct();
  const invalidateAvailableProducts = useInvalidateAvailableProducts();
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell align="right">Description</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Count</StyledTableCell>
            <StyledTableCell align="right">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortProductsById(data).map((product) => (
            <TableRow key={product.id}>
              <StyledTableCell component="th" scope="row">
                {product.title}
              </StyledTableCell>
              <StyledTableCell align="right">{product.description}</StyledTableCell>
              <StyledTableCell align="right">{formatAsPrice(product.price)}</StyledTableCell>
              <StyledTableCell align="right">{product.count}</StyledTableCell>
              <StyledTableCell align="right">
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 8 }}
                >
                  <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                      navigate(`/admin/product-form/${product.id}`, {
                        state: { product },
                      })
                    }
                  >
                    Manage
                  </Button>
                  <Button
                    size="small"
                    color="warning"
                    // variant="outlined"
                    onClick={() => {
                      if (product.id) {
                        deleteAvailableProduct(product.id, {
                          onSuccess: invalidateAvailableProducts,
                        });
                      }
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
