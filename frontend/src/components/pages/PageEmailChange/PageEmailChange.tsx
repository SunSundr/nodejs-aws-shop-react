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
import Grid from '@mui/material/Grid2';
import TextField from '../../../components/Form/TextField';
import API_PATHS, { COGNITO_USER_POOL_ID } from '../../../constants/apiPaths';
import { AuthSyncMessage, EMAIL_NEW, EMAIL_VERIFY_COUNTDOWN_KEY } from '../../../constants/common';
import { authHeaders, sendSyncAuthMessage } from '../../../utils/auth';
import { getAxiosErrorMessage } from '../../../utils/getAxiosErrorMessage';

interface EmailChangeValues {
  newEmail: string;
  verificationCode: string;
}

const emailValidation = Yup.string()
  .required('Email is required')
  .test('is-valid-email', 'Please enter a valid email address', (value) => {
    if (!value) return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) return false;

    const parts = value.split('@');
    if (parts[0].length < 1) return false;
    if (parts[1].length < 3) return false;

    return true;
  });

const EmailChangeSchema = Yup.object().shape({
  newEmail: emailValidation,
  verificationCode: Yup.string().when('$codeSent', {
    is: true,
    then: (schema) => schema.required('Verification code is required'),
    otherwise: (schema) => schema,
  }),
});

export default function PageEmailChange() {
  const initialValues: EmailChangeValues = {
    newEmail: localStorage.getItem(EMAIL_VERIFY_COUNTDOWN_KEY)
      ? localStorage.getItem(EMAIL_NEW) || ''
      : '',
    verificationCode: '',
  };

  const auth = useAuth();
  const navigate = useNavigate();
  const [isError, setIsError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [codeSent, setCodeSent] = useState(() => !!initialValues.newEmail);

  const [countdown, setCountdown] = useState(() => {
    const savedCountdown = localStorage.getItem(EMAIL_VERIFY_COUNTDOWN_KEY);
    return savedCountdown ? parseInt(savedCountdown, 10) : 0;
  });
  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      localStorage.setItem(EMAIL_VERIFY_COUNTDOWN_KEY, countdown.toString());
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem(EMAIL_VERIFY_COUNTDOWN_KEY);
      localStorage.removeItem(EMAIL_NEW);
    }
  }, [countdown]);

  const handleSendCode = async (email: string) => {
    setIsSendingCode(true);
    setIsError(null);

    try {
      const payload = {
        userPoolId: COGNITO_USER_POOL_ID,
        username: auth.user?.profile.sub || '',
        email,
      };

      localStorage.setItem(EMAIL_NEW, email);
      await axios.post(`${API_PATHS.profile}/user-attributes`, payload, {
        headers: authHeaders(auth, false),
      });

      setCodeSent(true);
      setCountdown(60);
    } catch (error) {
      console.error('Error sending verification code:', error);
      setIsError(getAxiosErrorMessage(error as AxiosError) || 'Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const onSubmit = async (values: EmailChangeValues) => {
    setIsError(null);

    try {
      const payload = {
        verificationCode: values.verificationCode,
      };

      await axios.post(`${API_PATHS.profile}/verify-email`, payload, {
        headers: authHeaders(auth, false),
      });

      setSendSuccess(true);
      setTimeout(async () => {
        await auth.signinSilent();
        sendSyncAuthMessage({ type: AuthSyncMessage.profile });
        localStorage.removeItem(EMAIL_VERIFY_COUNTDOWN_KEY);
        localStorage.removeItem(EMAIL_NEW);
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Error verifying email:', error);
      setIsError(getAxiosErrorMessage(error as AxiosError) || 'Failed to verify email');
    }
  };

  const cancelButton = (
    <Button
      color="primary"
      variant={isError ? 'contained' : 'outlined'}
      onClick={() => (isError ? setIsError(null) : navigate('/profile'))}
    >
      Cancel
    </Button>
  );

  return (
    <Box
      sx={{
        maxWidth: 480,
        minWidth: 280,
        margin: '32px auto',
      }}
    >
      <Paper sx={{ padding: 3, paddingBottom: 3.8 }}>
        <Typography component="h1" variant="h4" align="center" mb={3}>
          Change Email Address
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={EmailChangeSchema}
          onSubmit={onSubmit}
        >
          {({ values, isValid, isSubmitting, dirty }) => (
            <Form autoComplete="off" hidden={sendSuccess || !!isError}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name="newEmail"
                    label="New Email Address"
                    disabled={isSendingCode || isSubmitting || countdown > 0}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      !isValid || countdown > 0 || (!dirty && !values.newEmail) || isSubmitting
                    }
                    onClick={() => handleSendCode(values.newEmail)}
                    loading={isSendingCode}
                    sx={{ flex: 1 }}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Send Code'}
                  </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name="verificationCode"
                    label="Verification Code"
                    disabled={isSubmitting || !isValid}
                    fullWidth
                    required={codeSent}
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
                    disabled={!values.verificationCode || isSubmitting || !isValid}
                    sx={{ minWidth: '148px' }}
                    loading={isSubmitting}
                  >
                    Verify Email
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
              Email updated successfully!
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
