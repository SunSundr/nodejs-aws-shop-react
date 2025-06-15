import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CSVFileImport from '~/components/pages/admin/PageProductImport/components/CSVFileImport';
import ProductsTable from '~/components/pages/admin/PageProductImport/components/ProductsTable';
import ReloadButton from '~/components/ReloadButton/ReloadButton';
import API_PATHS from '~/constants/apiPaths';

export default function PageProductImport() {
  return (
    <Box py={3}>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Typography variant="h6" gutterBottom>
          Manage products
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <CSVFileImport url={`${API_PATHS.import}/import`} />
          <Button
            size="small"
            color="primary"
            variant="contained"
            sx={{ pb: 0.25, height: 26.75 }}
            component={Link}
            to={'/admin/product-form'}
          >
            Create product
          </Button>
          <ReloadButton type="products" />
        </div>
      </Box>
      <ProductsTable />
    </Box>
  );
}
