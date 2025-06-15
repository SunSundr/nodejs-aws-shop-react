import { Link } from 'react-router-dom';
import WestIcon from '@mui/icons-material/West';
import { IconButton } from '@mui/material';

export function GoBackButton({ navigate = '/' }) {
  return (
    <IconButton
      size="medium"
      component={Link}
      to={navigate}
      sx={{
        '&:hover': {
          background: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300],
        },
        mb: 0.4,
      }}
    >
      <WestIcon />
    </IconButton>
  );
}
