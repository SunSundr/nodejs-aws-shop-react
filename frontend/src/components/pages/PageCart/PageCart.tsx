import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import AddressForm from '~/components/pages/PageCart/components/AddressForm';
import ReviewCart from '~/components/pages/PageCart/components/ReviewCart';
import ReviewOrder from '~/components/pages/PageCart/components/ReviewOrder';
import PaperLayout from '~/components/PaperLayout/PaperLayout';
import { Address, AddressSchema, OrderPart } from '~/models/Order';
import { AvailableProduct, Product } from '~/models/Product';
import { useCart, useInvalidateCart } from '~/queries/cart';
import { useInvalidateOrders, useSubmitOrder } from '~/queries/orders';
import { getErrorProduct, useAvailableProducts, useRemoveProductCache } from '~/queries/products';

enum CartStep {
  ReviewCart,
  Address,
  ReviewOrder,
  Success,
}

const initialAddressValues = AddressSchema.cast({});

const CartIsEmpty = () => (
  <Typography variant="h6" gutterBottom>
    The cart is empty. Didn&apos;t you like anything in our shop?
  </Typography>
);

const Success = () => (
  <React.Fragment>
    <Typography variant="h5" gutterBottom>
      Thank you for your order.
    </Typography>
    <Typography variant="subtitle1">
      Your order is placed. Our manager will call you soon to clarify the details.
    </Typography>
  </React.Fragment>
);

const steps = ['Review your cart', 'Shipping address', 'Review your order'];

export default function PageCart() {
  const cartData = useCart().data || [];
  const { mutate: submitOrder } = useSubmitOrder();
  const invalidateCart = useInvalidateCart();
  const [activeStep, setActiveStep] = React.useState<CartStep>(CartStep.ReviewCart);
  const [address, setAddress] = useState<Address>(initialAddressValues);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;

  const isCartEmpty = cartData.length === 0;
  const { data = [], isLoading } = useAvailableProducts();
  const invalidateOrders = useInvalidateOrders();
  const removeProductCache = useRemoveProductCache();

  const getProductsById = (id: string): Product => {
    return data.find((item) => item.id === id) || getErrorProduct(id);
  };

  const updatedData = cartData.map((item) => ({
    ...item,
    product: getProductsById(String(item.product.id)),
  }));

  const totalPrice: number = updatedData.reduce(
    (total, item) => item.count * item.product.price + total,
    0,
  );

  const handleNext = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (activeStep !== CartStep.ReviewOrder) {
      if (activeStep === CartStep.ReviewCart && event) {
        for (const item of updatedData) {
          if (item.count > (item.product as AvailableProduct).count) {
            setAnchorEl(event.currentTarget);
            setTimeout(() => setAnchorEl(null), 1000);
            return;
          }
        }
      }
      setActiveStep((step) => step + 1);
      return;
    }

    const values: OrderPart = {
      items: cartData.map((i) => ({
        productId: i.product.id!,
        count: i.count,
        category: i.product.category!,
      })),
      delivery: address,
      total: totalPrice,
      cartId: cartData[0].cartId || '',
    };
    setIsSubmitting(true);

    submitOrder(values, {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: () => {
        setActiveStep(activeStep + 1);
        invalidateCart();
        values.items.forEach((item) => {
          removeProductCache(item.productId);
        });
        setTimeout(() => invalidateOrders(), 3000);
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddressSubmit = (values: Address) => {
    setAddress(values);
    handleNext();
  };

  if (isLoading) {
    return <LoadingSpinner offset={480} />;
  }

  return (
    <PaperLayout>
      <Typography component="h1" variant="h4" align="center">
        Checkout
      </Typography>
      <Stepper activeStep={activeStep} sx={{ padding: (theme) => theme.spacing(3, 0, 5) }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {isCartEmpty && <CartIsEmpty />}
      {!isCartEmpty && activeStep === CartStep.ReviewCart && <ReviewCart items={updatedData} />}
      {activeStep === CartStep.Address && (
        <AddressForm initialValues={address} onBack={handleBack} onSubmit={handleAddressSubmit} />
      )}
      {activeStep === CartStep.ReviewOrder && <ReviewOrder address={address} items={updatedData} />}
      {activeStep === CartStep.Success && <Success />}
      {!isCartEmpty && activeStep !== CartStep.Address && activeStep !== CartStep.Success && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {activeStep !== CartStep.ReviewCart && (
            <Button variant="outlined" onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, ml: 1 }}
            onClick={handleNext}
            loading={isSubmitting}
          >
            {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
          </Button>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{ left: -4, cursor: 'pointer' }}
          >
            <Typography color="error" sx={{ p: 1, cursor: 'default' }}>
              Some products are out of stock!
            </Typography>
          </Popover>
        </Box>
      )}
    </PaperLayout>
  );
}
