import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddProductToCart from '~/components/AddProductToCart/AddProductToCart';
import { CartItem } from '~/models/CartItem';
import { formatAsPrice, truncateDescription } from '~/utils/utils';

type CartItemsProps = {
  items: CartItem[];
  isEditable: boolean;
};

export default function CartItems({ items, isEditable }: CartItemsProps) {
  const totalPrice: number = items.reduce(
    (total, item) => item.count * item.product.price + total,
    0,
  );

  return (
    <>
      <List disablePadding>
        {items.map((cartItem: CartItem) => (
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
