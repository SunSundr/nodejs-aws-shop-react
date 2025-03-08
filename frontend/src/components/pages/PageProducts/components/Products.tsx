import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import AddProductToCart from '~/components/AddProductToCart/AddProductToCart';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import ProductImage from '~/components/ProductImage/ProductImage';
import { useAvailableProducts } from '~/queries/products';
import { formatAsPrice, sortProductsById, truncateDescription } from '~/utils/utils';

export default function Products() {
  const { data = [], isLoading } = useAvailableProducts();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Grid container spacing={4}>
      {sortProductsById(data).map(({ count, ...product }, index) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea
              onClick={() =>
                navigate(`/products/${product.id}`, {
                  state: { index, product },
                })
              }
            >
              <CardMedia
                sx={{ mb: -0.5 }}
                title={product.title}
                children={
                  <ProductImage
                    index={index}
                    src={product.imageURL}
                    alt={`${product.title} image`}
                  />
                }
              />
              <CardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', paddingBottom: '0' }}
              >
                <Typography gutterBottom variant="h5" component="h2">
                  {product.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 'small',
                    paddingBottom: '10px',
                    color: 'text.secondary',
                  }}
                >
                  {truncateDescription(product.description)}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
              <AddProductToCart product={product} />
              <Typography sx={{ fontWeight: 'bold', paddingRight: '16px' }}>
                {formatAsPrice(product.price)}
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
