import { Field, Form, Formik } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TextField from '~/components/Form/TextField';
import { Address, AddressSchema } from '~/models/Order';

type AddressFormProps = {
  initialValues: Address;
  onBack: () => void;
  onSubmit: (values: Address) => void;
};

const AddressForm = ({ initialValues, onBack, onSubmit }: AddressFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={AddressSchema}
      validateOnMount={true}
      onSubmit={onSubmit}
    >
      <Form autoComplete="off">
        <Typography variant="h6" sx={{ mb: 2 }}>
          Shipping address
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field component={TextField} name="lastName" label="Last Name" fullWidth />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field component={TextField} name="firstName" label="First Name" fullWidth />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field
              component={TextField}
              name="address"
              label="Shipping address"
              fullWidth
              multiline
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field component={TextField} name="comment" label="Comment" fullWidth multiline />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={onBack} sx={{ mt: 3, ml: 1 }}>
            Back
          </Button>
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 3, ml: 1 }}>
            Next
          </Button>
        </Box>
      </Form>
    </Formik>
  );
};

export default AddressForm;
