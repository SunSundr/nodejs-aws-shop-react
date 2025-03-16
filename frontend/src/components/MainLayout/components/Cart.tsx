import { Link } from 'react-router-dom';
import CartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useCart } from '~/queries/cart';

export default function Cart() {
  const { data = [] } = useCart();
  const badgeContent = data.length || undefined;

  return (
    <Tooltip title="Cart">
      <IconButton color="inherit" component={Link} to="/cart" size="large">
        <Badge badgeContent={badgeContent} color="secondary">
          <CartIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
