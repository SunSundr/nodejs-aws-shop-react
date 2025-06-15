import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import { PopUp } from '~/components/utils/PopUp';
import { useAvailableProducts, useDeleteAvailableProduct } from '~/queries/products';
import { StyledTableCell } from '~/theme';
import { formatAsPrice, sortProductsById } from '~/utils/utils';

export default function ProductsTable() {
  const { data = [], isLoading } = useAvailableProducts();
  const { mutate: deleteAvailableProduct } = useDeleteAvailableProduct();
  const [processingProductId, setProcessingProductId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [alertAction, setAlertAction] = useState<{ error?: Error | null; success?: string }>({
    error: null,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
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
                      sx={{ minHeight: '32px' }}
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
                      sx={{ minHeight: '32px' }}
                      loading={processingProductId === product.id}
                      onClick={() => {
                        if (product.id) {
                          setProcessingProductId(product.id);
                          deleteAvailableProduct(product, {
                            onSuccess: async () => {
                              setAlertAction({
                                success: `Product "${product.title}" has been successfully deleted.`,
                              });
                            },
                            onError: (err) => setAlertAction({ error: err }),
                            onSettled: () => setProcessingProductId(null),
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
      <PopUp error={alertAction.error} success={alertAction.success} />
    </>
  );
}
