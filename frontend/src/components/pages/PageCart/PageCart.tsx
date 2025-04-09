import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import AddressForm from '~/components/pages/PageCart/components/AddressForm';
import ReviewCart from '~/components/pages/PageCart/components/ReviewCart';
import ReviewOrder from '~/components/pages/PageCart/components/ReviewOrder';
import PaperLayout from '~/components/PaperLayout/PaperLayout';
import { Address, AddressSchema, Order } from '~/models/Order';
import { Product } from '~/models/Product';
import { useCart, useInvalidateCart } from '~/queries/cart';
import { useSubmitOrder } from '~/queries/orders';
import { getErrorProduct, useAvailableProducts } from '~/queries/products';

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

  const isCartEmpty = cartData.length === 0;

  //------------------------
  const { data = [], isLoading } = useAvailableProducts();

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

  //------------------------

  const handleNext = () => {
    if (activeStep !== CartStep.ReviewOrder) {
      setActiveStep((step) => step + 1);
      return;
    }
    const values = {
      items: cartData.map((i) => ({
        productId: i.product.id,
        count: i.count,
      })),
      address,
      total: totalPrice,
    };

    submitOrder(values as Omit<Order, 'id'>, {
      onSuccess: () => {
        setActiveStep(activeStep + 1);
        invalidateCart();
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
          <Button variant="contained" color="primary" sx={{ mt: 3, ml: 1 }} onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
          </Button>
        </Box>
      )}
    </PaperLayout>
  );
}
