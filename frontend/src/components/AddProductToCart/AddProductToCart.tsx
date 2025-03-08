import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import CartIcon from '@mui/icons-material/ShoppingCart';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Product } from '~/models/Product';
import { useCart, useInvalidateCart, useUpsertCart } from '~/queries/cart';

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const cartItem = data.find((i) => i.product.id === product.id);

  const addProduct = () => {
    upsertCart(
      { product, count: cartItem ? cartItem.count + 1 : 1 },
      { onSuccess: invalidateCart },
    );
  };

  const removeProduct = () => {
    if (cartItem) {
      upsertCart({ ...cartItem, count: cartItem.count - 1 }, { onSuccess: invalidateCart });
    }
  };

  return cartItem ? (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8 }}>
      <IconButton disabled={isFetching} onClick={removeProduct} size="large">
        <Remove color={'secondary'} />
      </IconButton>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isFetching} onClick={addProduct} size="large">
        <Add color={'secondary'} />
      </IconButton>
    </Box>
  ) : (
    <IconButton disabled={isFetching} onClick={addProduct} size="large">
      <CartIcon color={'secondary'} />
    </IconButton>
  );
}
