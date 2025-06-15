import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ErrorIcon from '@mui/icons-material/Error';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import TextField from '../../../components/Form/TextField';
import API_PATHS, { COGNITO_USER_POOL_ID } from '../../../constants/apiPaths';
import { AuthSyncMessage } from '../../../constants/common';
import { authHeaders, sendSyncAuthMessage } from '../../../utils/auth';
import { getAxiosErrorMessage } from '../../../utils/getAxiosErrorMessage';

interface ProfileValues {
  // email: string;
  givenName: string;
  familyName: string;
  shipping: string;
}

interface UpdateUserAttributesDTO {
  userPoolId: string;
  username: string;
  // email?: string;
  givenName?: string;
  familyName?: string;
  shipping?: string;
}

const ProfileSchema = Yup.object().shape({
  //email: Yup.string().email('Invalid email').required('Email is required'),
  givenName: Yup.string().required('First Name is required'),
  familyName: Yup.string().required('Last Name is required'),
  shipping: Yup.string(),
});

export default function PageProfile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isError, setIsError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/');
  }, [auth.user, navigate]);

  const initialValues: ProfileValues = {
    // email: auth.user?.profile.email || '',
    givenName: auth.user?.profile.given_name || '',
    familyName: auth.user?.profile.family_name || '',
    shipping: (auth.user?.profile['custom:shipping'] as string) || '',
  };

  const onSubmit = async (values: ProfileValues) => {
    setIsError(null);

    try {
      const payload: UpdateUserAttributesDTO = {
        userPoolId: COGNITO_USER_POOL_ID,
        username: auth.user?.profile.sub || '',
      };

      if (initialValues.familyName !== values.familyName) payload.familyName = values.familyName;
      if (initialValues.givenName !== values.givenName) payload.givenName = values.givenName;
      if (initialValues.shipping !== values.shipping) payload.shipping = values.shipping;

      await axios.post(`${API_PATHS.profile}/user-attributes`, payload, {
        headers: authHeaders(auth, false),
      });

      setSendSuccess(true);
      setTimeout(async () => {
        await auth.signinSilent();
        sendSyncAuthMessage({ type: AuthSyncMessage.profile });
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsError(getAxiosErrorMessage(error as AxiosError) || 'Failed to update profile');
    }
  };

  const cancelButton = (
    <Button
      color="primary"
      variant={isError ? 'contained' : 'outlined'}
      onClick={() => (isError ? setIsError(null) : navigate('/'))}
    >
      Cancel
    </Button>
  );

  return (
    <Box
      sx={{
        my: 4,
        maxWidth: 480,
        minWidth: 280,
        margin: '32px auto',
      }}
    >
      <Paper sx={{ padding: 3, paddingBottom: 3.8 }}>
        <Typography component="h1" variant="h4" align="center" mb={2}>
          Update Profile
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ dirty, isValid, isSubmitting }) => (
            <Form autoComplete="off" hidden={sendSuccess || !!isError}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                      mt: 1,
                    }}
                  >
                    <Chip
                      label={<>Email: {auth.user?.profile.email}</>}
                      variant="outlined"
                      size="medium"
                      color="default"
                      sx={{
                        fontSize: '1rem',
                        borderRadius: '4px',
                        minHeight: '36.5px',
                        width: '100%',
                        userSelect: 'none',
                        color: (theme) => theme.palette.secondary.dark,
                        // background: (theme) => theme.palette.action.selected,
                      }}
                    />
                    <Button
                      variant="outlined"
                      sx={{ width: '30%' }}
                      onClick={() => navigate('/profile/email')}
                    >
                      Change
                    </Button>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name="givenName"
                    label="First Name"
                    disabled={isSubmitting}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name="familyName"
                    label="Last Name"
                    disabled={isSubmitting}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name="shipping"
                    label="Default Shipping Address"
                    disabled={isSubmitting}
                    fullWidth
                  />
                </Grid>

                <Grid
                  container
                  size={{ xs: 12 }}
                  justifyContent="flex-end"
                  style={{ marginTop: '16px' }}
                >
                  {cancelButton}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!dirty || isSubmitting || !isValid}
                    sx={{ minWidth: '148px' }}
                    loading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        {sendSuccess && (
          <Box textAlign="center">
            <TaskAltIcon color="success" sx={{ fontSize: 42 }} />
            <Typography color="success" mb={2}>
              Profile updated successfully!
            </Typography>
          </Box>
        )}

        {isError && (
          <Box textAlign="center">
            <ErrorIcon color="error" sx={{ fontSize: 42 }} />
            <Typography color="error" mb={2}>
              Error: {isError}
            </Typography>
            {cancelButton}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
