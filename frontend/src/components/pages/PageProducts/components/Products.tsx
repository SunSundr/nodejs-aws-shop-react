import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { formatAsPrice, sortProductsById } from '~/utils/utils';
import AddProductToCart from '~/components/AddProductToCart/AddProductToCart';
import { useAvailableProducts } from '~/queries/products';

export default function Products() {
  const { data = [], isLoading } = useAvailableProducts();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const imageError = (index: number) => {
    let error = false;
    return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (error) return;
      error = true;
      (e.target as HTMLImageElement).src = `https://picsum.photos/400/300?random=${index}`;
    };
  };

  const truncateText = (text: string, maxLength = 220) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <Grid container spacing={4}>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {sortProductsById(data).map(({ count, ...product }, index) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              sx={{ mb: -1 }}
              title={product.title}
              children={
                <img
                  style={{
                    aspectRatio: 1.75,
                    width: '100%',
                    height: '100%',
                    minHeight: 'calc(100% / 1.75)',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    pointerEvents: 'none',
                  }}
                  alt={`${product.title} image`}
                  src={
                    product.imageURL
                      ? product.imageURL
                      : `https://picsum.photos/400/300?random=${index}`
                  }
                  onError={imageError(index)}
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
                }}
              >
                {truncateText(product.description)}
              </Typography>
              <Typography sx={{ marginTop: 'auto', fontWeight: 'bold' }}>
                {formatAsPrice(product.price)}
              </Typography>
            </CardContent>
            <CardActions>
              <AddProductToCart product={product} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
