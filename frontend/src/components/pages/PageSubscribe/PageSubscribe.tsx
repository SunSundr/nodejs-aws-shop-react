import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import ErrorIcon from '@mui/icons-material/Error';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import TextField from '~/components/Form/TextField';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import API_PATHS from '~/constants/apiPaths';
import { Subscription, SubscriptionsSchema } from '~/models/Product';

export default function PageSubscribe() {
  const navigate = useNavigate();
  const inttialValues: Subscription = {
    email: '',
    filterType: 'none',
    minPrice: 0,
    maxPrice: 50,
    keywords: '',
  };
  const [filterType, setfilterType] = useState<string>(inttialValues.filterType);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const onSubmit = (values: Subscription) => {
    console.log(values);
    setIsLoading(true);
    fetch(`${API_PATHS.subscribe}/products/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then(async (response) => {
        if (response.ok) {
          setSendSuccess(true);
        } else {
          const bodyContent = await response.text();
          try {
            const errorData = JSON.parse(bodyContent);
            setIsError(errorData.message || 'Failed to subscribe. Please try again.');
          } catch (error) {
            console.error('Error:', error);
            setIsError('Failed to subscribe. Please try again.');
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsError('An error occurred. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const title = (
    <Typography component="h1" variant="h4" align="center" mb={2}>
      Subscribe to new products
    </Typography>
  );
  const cancelButton = (
    <Button
      color="primary"
      variant={isError ? 'contained' : 'outlined'}
      onClick={() => (isError ? setIsError(null) : navigate('/'))}
    >
      Cancel
    </Button>
  );

  const okButton = (
    <Button color="primary" variant="contained" onClick={() => navigate('/')}>
      Ok
    </Button>
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          mx: 28,
          my: 4,
        }}
      >
        <Paper sx={{ padding: 3 }}>
          {title}
          {isLoading && <LoadingSpinner offset={480} />}
          {cancelButton}
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mx: 28,
        my: 4,
      }}
    >
      <Paper sx={{ padding: 3 }}>
        {title}
        <Formik
          initialValues={inttialValues}
          validationSchema={SubscriptionsSchema}
          onSubmit={onSubmit}
        >
          {({ dirty, isValid, isSubmitting, values }) => (
            <Form autoComplete="off" hidden={sendSuccess || !!isError}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    autoComplete="off"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Filter Type</FormLabel>
                    <RadioGroup
                      row
                      name="filterType"
                      value={filterType}
                      onChange={(e) => {
                        setfilterType(e.target.value);
                        values.filterType = e.target.value;
                        if (e.target.value !== 'price') {
                          values.minPrice = 0;
                          values.maxPrice = 0;
                        }
                        if (e.target.value !== 'keywords') {
                          values.keywords = '';
                        }
                      }}
                    >
                      <FormControlLabel value="none" control={<Radio />} label="No Filter" />
                      <FormControlLabel value="price" control={<Radio />} label="Price Range" />
                      <FormControlLabel value="keywords" control={<Radio />} label="Keywords" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {values.filterType === 'price' && (
                  <>
                    <Grid size={{ xs: 6 }}>
                      <Field
                        component={TextField}
                        name="minPrice"
                        label="Min Price"
                        type="number"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Field
                        component={TextField}
                        name="maxPrice"
                        label="Max Price"
                        type="number"
                        fullWidth
                        required
                      />
                    </Grid>
                  </>
                )}

                {values.filterType === 'keywords' && (
                  <Grid size={{ xs: 12 }}>
                    <Field
                      component={TextField}
                      name="keywords"
                      label="Keywords (comma separated)"
                      fullWidth
                      required
                    />
                  </Grid>
                )}

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
                    disabled={!dirty || isSubmitting || !isValid}
                  >
                    Subscribe
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        {sendSuccess && (
          <>
            <div style={{ textAlign: 'center' }}>
              <TaskAltIcon color="success" sx={{ fontSize: 42 }} />
              <Typography color="success" mb={2} sx={{ textAlign: 'center', paddingBottom: '8px' }}>
                Subscription request sent!
                <br />
                Please check your email to confirm!
              </Typography>
              {okButton}
            </div>
          </>
        )}
        {isError && (
          <>
            <div style={{ textAlign: 'center' }}>
              <ErrorIcon color="error" sx={{ fontSize: 42 }} />
              <Typography color="error" mb={2} sx={{ textAlign: 'center', paddingBottom: '8px' }}>
                Error: {isError}
              </Typography>
              {cancelButton}
            </div>
          </>
        )}
      </Paper>
    </Box>
  );
}
