import { Link } from 'react-router-dom';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function PageNotFound() {
  return (
    <Box
      py={3}
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 240px)',
      }}
    >
      <Typography variant="h4" mb={2}>
        <FlutterDashIcon sx={{ fontSize: '4rem' }} /> Oops...
      </Typography>
      <Typography variant="h3" mb={2}>
        404 Page not found
      </Typography>
      <Button color="primary" variant="contained" component={Link} to="/" sx={{ mt: 3 }}>
        Go to Home Page
      </Button>
    </Box>
  );
}
