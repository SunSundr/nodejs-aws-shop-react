import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Orders from '~/components/pages/PageOrders/components/Orders';
import ReloadButton from '~/components/ReloadButton/ReloadButton';

export default function PageOrders() {
  return (
    <Box py={3}>
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Typography variant="h6" gutterBottom>
          Manage orders
        </Typography>
        <ReloadButton type="orders" />
      </Box>
      <Orders />
    </Box>
  );
}
