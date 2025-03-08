import { Link, useLocation, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import AddProductToCart from '~/components/AddProductToCart/AddProductToCart';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ProductImage from '~/components/ProductImage/ProductImage';
import { getErrorMessage, useAvailableProduct } from '~/queries/products';
import { formatAsPrice } from '~/utils/utils';

const DetailPage: React.FC = () => {
  const location = useLocation();
  const { index, product } = location.state || {};
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = product
    ? { data: product, isLoading: false, isError: false, error: null }
    : useAvailableProduct(id);

  const goBackButton = (
    <Button variant="outlined" component={Link} to={'/'} sx={{ mt: 0.5, mb: 1.5 }}>
      Return to home
    </Button>
  );

  const errorCard = (error: AxiosError | null) => {
    return (
      <Card>
        <Typography variant="h6" color="warning" mb={3} mt={3} sx={{ textAlign: 'center' }}>
          Error: {getErrorMessage(error) || 'Unknown error'}
        </Typography>
      </Card>
    );
  };

  if (isLoading || isError) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        {goBackButton}
        {isLoading && <LoadingSpinner />}
        {isError && errorCard(error)}
      </Box>
    );
  } else if (!data) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        {goBackButton}
        {errorCard(error)}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      {goBackButton}
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
          <Typography variant="h4" component="h1" gutterBottom>
            {data.title}
          </Typography>
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
