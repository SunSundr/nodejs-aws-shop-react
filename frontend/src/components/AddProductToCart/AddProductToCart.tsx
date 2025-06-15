import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import CartIcon from '@mui/icons-material/ShoppingCart';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { AvailableProduct, Product } from '~/models/Product';
import { useCart, useUpdateCart } from '~/queries/cart';
import { PopUp } from '../utils/PopUp';

type AddProductToCartProps = {
  product: AvailableProduct;
  showWarning?: boolean;
};

export default function AddProductToCart({ product, showWarning }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: updateCart } = useUpdateCart();
  const cartItem = data.find((i) => i.product?.id === product.id);
  const auth = useAuth();
  const [requiredAuthError, setRequiredAuthError] = useState<Error | null>(null);
  const [updateCartError, setUpdateCartError] = useState<Error | null>(null);

  const clearErrors = () => {
    setRequiredAuthError(null);
    setUpdateCartError(null);
  };

  const addProduct = () => {
    clearErrors();
    if (!auth.isAuthenticated) {
      setRequiredAuthError(new Error('Please sign in to add products to cart'));
      return;
    }
    const count = cartItem ? cartItem.count + 1 : 1;
    const cartId = data[0]?.cartId;
    console.log(cartId);
    if (count > product.count) {
      return;
    }
    updateCart(
      { cartId, product: { id: product.id, category: product.category } as Product, count },
      { onError: setUpdateCartError },
    );
  };

  const removeProduct = () => {
    clearErrors();
    if (cartItem) {
      updateCart({ ...cartItem, count: cartItem.count - 1 }, { onError: setUpdateCartError });
    }
  };

  return cartItem ? (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8 }}>
        <IconButton disabled={isFetching} onClick={removeProduct} size="large">
          <Remove color={'secondary'} />
        </IconButton>
        <Typography align="center" sx={{ userSelect: 'none' }}>
          {cartItem.count}
        </Typography>
        <IconButton
          disabled={isFetching || product.count <= cartItem.count}
          onClick={addProduct}
          size="large"
        >
          <Add color={product.count <= cartItem.count ? 'disabled' : 'secondary'} />
        </IconButton>
      </Box>
      {showWarning && cartItem.count > product.count && (
        <Typography
          align="center"
          sx={{
            userSelect: 'none',
            fontSize: '0.8rem',
            color: (theme) => theme.palette.error.dark,
          }}
        >
          {product.count === 0 ? 'Out of stock' : `Only ${product.count} in\u00A0stock`}
        </Typography>
      )}
    </>
  ) : (
    <>
      {product.count > 0 ? (
        <IconButton disabled={isFetching} onClick={addProduct} size="large">
          <CartIcon color={'secondary'} />
        </IconButton>
      ) : (
        <Tooltip title="Out of stock" placement="right" color={'error'}>
          <span>
            <IconButton disabled size="large">
              <RemoveShoppingCartIcon color={'disabled'} />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <PopUp
        error={requiredAuthError || updateCartError}
        button={
          requiredAuthError ? { text: 'Sign in', action: () => auth.signinRedirect() } : undefined
        }
        severity={requiredAuthError ? 'warning' : 'error'}
      />
    </>
  );
}
