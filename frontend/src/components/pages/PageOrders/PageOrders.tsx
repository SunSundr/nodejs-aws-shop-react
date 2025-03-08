import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Orders from '~/components/pages/PageOrders/components/Orders';

export default function PageOrders() {
  return (
    <Box py={3}>
      <Typography variant="h6" gutterBottom>
        Manage orders
      </Typography>
      <Orders />
    </Box>
  );
}
