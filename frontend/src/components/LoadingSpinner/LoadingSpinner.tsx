import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  thickness?: number;
  offset?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 100,
  thickness = 1.4,
  offset = 228,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: `calc(100vh - ${offset}px)`,
      }}
    >
      <CircularProgress
        sx={(theme) => ({
          color: theme.palette.grey[400],
          ...theme.applyStyles('dark', {
            color: theme.palette.grey[800],
          }),
        })}
        size={size}
        thickness={thickness}
      />
    </Box>
  );
};

export default LoadingSpinner;
