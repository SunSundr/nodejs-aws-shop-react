import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddProductToCart from '~/components/AddProductToCart/AddProductToCart';
import { CartItem } from '~/models/CartItem';
import { Product } from '~/models/Product';
import { useAvailableProducts } from '~/queries/products';
import { formatAsPrice, truncateDescription } from '~/utils/utils';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

type CartItemsProps = {
  items: CartItem[];
  isEditable: boolean;
};

const errorProduct: Product = {
  id: 'error',
  title: 'Error',
  description: 'Error',
  price: 0,
  imageURL: '',
};

export default function CartItems({ items, isEditable }: CartItemsProps) {
  const { data = [], isLoading } = useAvailableProducts();

  const getProductsById = (id: string): Product => {
    return data.find((item) => item.id === id) || errorProduct;
  };

  const updatedItems = items.map((item) => ({
    ...item,
    product: getProductsById(String(item.product.id)),
  }));

  const totalPrice: number = items.reduce(
    (total, item) => item.count * item.product.price || 0 + total,
    0,
  );

  if (isLoading) {
    return <LoadingSpinner offset={480} />;
  }

  return (
    <>
      <List disablePadding>
        {updatedItems.map((cartItem: CartItem) => (
          <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }} key={cartItem.product.id}>
            {isEditable && (
              <div style={{ marginRight: 16 }}>
                <AddProductToCart product={cartItem.product} />{' '}
              </div>
            )}
            <ListItemText
              primary={cartItem.product.title}
              secondary={truncateDescription(cartItem.product.description)}
            />
            <Typography variant="body2" sx={{ textWrap: 'nowrap' }}>
              {formatAsPrice(cartItem.product.price)} x {cartItem.count} ={' '}
              {formatAsPrice(cartItem.product.price * cartItem.count)}
            </Typography>
          </ListItem>
        ))}
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body2">Free</Typography>
        </ListItem>
        <ListItem sx={{ padding: (theme) => theme.spacing(1, 0) }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {formatAsPrice(totalPrice)}
          </Typography>
        </ListItem>
      </List>
    </>
  );
}
