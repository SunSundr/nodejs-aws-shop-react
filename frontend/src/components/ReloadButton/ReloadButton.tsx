import { useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useInvalidateOrders } from '../../queries/orders';
import { useInvalidateAvailableProducts } from '../../queries/products';

type ReloadButtonProps = {
  type: 'products' | 'orders';
};

export default function ReloadButton({ type }: ReloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const invalidate = type === 'products' ? useInvalidateAvailableProducts() : useInvalidateOrders();

  const handelClick = async () => {
    setLoading(true);
    await invalidate();
    setLoading(false);
  };

  return (
    <Tooltip title={`Reload ${type}`}>
      <IconButton
        aria-label="reload"
        onClick={handelClick}
        color="inherit"
        size="small"
        sx={{ mr: 0.5, ml: -1.8 }}
        loading={loading}
      >
        <CachedIcon />
      </IconButton>
    </Tooltip>
  );
}
