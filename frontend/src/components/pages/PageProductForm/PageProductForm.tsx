import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik, FormikProps } from 'formik';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TextField from '~/components/Form/TextField';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import PaperLayout from '~/components/PaperLayout/PaperLayout';
import { AvailableProduct, AvailableProductSchema } from '~/models/Product';
import {
  getErrorMessage,
  useAvailableProduct,
  useInvalidateAvailableProducts,
  useRemoveProductCache,
  useUpsertAvailableProduct,
} from '~/queries/products';

const initialValues: AvailableProduct = AvailableProductSchema.cast({});

export default function PageProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { product } = location.state || {};

  const invalidateAvailableProducts = useInvalidateAvailableProducts();
  const removeProductCache = useRemoveProductCache();
  const { data, isLoading, isError, error } = product
    ? { data: product, isLoading: false, isError: false, error: null }
    : useAvailableProduct(id);

  const { mutateAsync: upsertAvailableProduct } = useUpsertAvailableProduct(id);
  const onSubmit = (values: AvailableProduct) => {
    const formattedValues = AvailableProductSchema.cast(values);
    const productToSave = id
      ? {
          ...formattedValues,
          id,
        }
      : formattedValues;
    return upsertAvailableProduct(productToSave, {
      onSuccess: () => {
        invalidateAvailableProducts();
        removeProductCache(id);
        navigate('/admin/products');
      },
    });
  };

  const title = (
    <Typography component="h1" variant="h4" align="center" mb={2}>
      {id ? 'Edit Product' : 'Create New Product'}
    </Typography>
  );

  const cancelButton = (
    <Button color="primary" variant="outlined" onClick={() => navigate('/admin/products')}>
      Cancel
    </Button>
  );

  if (isLoading || isError) {
    return (
      <PaperLayout>
        {title}
        {isLoading && <LoadingSpinner offset={520} />}
        {isError && (
          <Typography color="warning" mb={2} sx={{ textAlign: 'center' }}>
            Error: {getErrorMessage(error)}
          </Typography>
        )}
        {cancelButton}
      </PaperLayout>
    );
  }

  return (
    <PaperLayout>
      {title}
      <Formik
        initialValues={data ?? initialValues}
        validationSchema={AvailableProductSchema}
        onSubmit={onSubmit}
      >
        {({ dirty, isSubmitting }: FormikProps<AvailableProduct>) => (
          <Form autoComplete="off">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <div>{getErrorMessage(error)}</div>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field
                  component={TextField}
                  name="title"
                  label="Title"
                  fullWidth
                  autoComplete="off"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field
                  component={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  autoComplete="off"
                  multiline
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Field
                  component={TextField}
                  name="imageURL"
                  label="Image URL"
                  fullWidth
                  autoComplete="off"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Field
                  component={TextField}
                  name="price"
                  label="Price ($)"
                  type="number"
                  fullWidth
                  autoComplete="off"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Field
                  component={TextField}
                  type="number"
                  name="count"
                  label="Count"
                  fullWidth
                  autoComplete="off"
                  required
                />
              </Grid>
              <Grid
                container
                size={{ xs: 12 }}
                justifyContent="space-between"
                style={{ marginTop: '16px' }}
              >
                {cancelButton}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!dirty || isSubmitting}
                >
                  Save Product
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </PaperLayout>
  );
}
