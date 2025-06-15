import { useLocation, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Box, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import AddProductToCart from '~/components/AddProductToCart/AddProductToCart';
import { GoBackButton } from '~/components/GoBackButton/GoBackButton';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ProductImage from '~/components/ProductImage/ProductImage';
import { useAvailableProduct } from '~/queries/products';
import { getAxiosErrorMessage } from '~/utils/getAxiosErrorMessage';
import { formatAsPrice } from '~/utils/utils';

const DetailPage: React.FC = () => {
  const location = useLocation();
  const { index, product } = location.state || {};
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = product
    ? { data: product, isLoading: false, isError: false, error: null }
    : useAvailableProduct(id);

  // const goBackButton = (
  //   <IconButton
  //     size="medium"
  //     component={Link}
  //     to={'/'}
  //     sx={{
  //       '&:hover': {
  //         background: (theme) =>
  //           theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300],
  //       },
  //       mb: 0.4,
  //     }}
  //   >
  //     <WestIcon />
  //   </IconButton>
  // );

  const errorCard = (error: AxiosError | null) => {
    return (
      <Card>
        <Typography variant="h6" color="warning" mb={3} mt={3} sx={{ textAlign: 'center' }}>
          Error: {getAxiosErrorMessage(error) || 'Unknown error'}
        </Typography>
      </Card>
    );
  };

  if (isLoading || isError) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        <GoBackButton />
        {isLoading && <LoadingSpinner />}
        {isError && errorCard(error)}
      </Box>
    );
  } else if (!data) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        <GoBackButton />
        {errorCard(error)}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <GoBackButton />
      <Card>
        <CardMedia
          children={
            <ProductImage
              index={index ?? Math.floor(Math.random() * 100) + 1}
              src={data.imageURL}
              alt={`${data.title} image`}
            />
          }
        />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {data.title}
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              gutterBottom
              sx={{
                color: (theme) => {
                  if (data.count <= 3) return theme.palette.error.light;
                  if (data.count <= 10) return theme.palette.warning.light;
                  return theme.palette.info.light;
                },
                fontSize: '1rem',
                fontStyle: 'italic',
                marginRight: '8px',
              }}
            >
              {data.count > 0 ? `${data.count} left in stock` : 'out of stock'}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: 'text.secondary',
            }}
          >
            {data.description || 'No description available.'}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <AddProductToCart product={data} />
          <Typography
            sx={{
              fontWeight: 'bold',
              paddingRight: '16px',
              fontSize: '1.1rem',
              userSelect: 'none',
            }}
          >
            {formatAsPrice(data.price)}
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default DetailPage;
