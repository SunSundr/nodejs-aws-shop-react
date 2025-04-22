import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ErrorIcon from '@mui/icons-material/Error';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import TextField from '~/components/Form/TextField';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import API_PATHS from '~/constants/apiPaths';

// temporary solution (task 8)

interface AuthFormProps {
  mode: 'login' | 'register';
}

interface LoginValues {
  username: string;
  password: string;
}

interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Name is required'),
  password: Yup.string().required('Password is required'),
});

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function PageLoginTask8({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const isLogin = mode === 'login';

  const initialValues: LoginValues | RegisterValues = isLogin
    ? { username: '', password: '' }
    : { name: '', email: '', password: '' };

  const onSubmit = async (values: LoginValues | RegisterValues) => {
    setIsError(null);
    setIsLoading(true);
    const logIn = async (vals = values) => {
      const path = `${API_PATHS.bff}/login`;
      const response = await axios.post(path, vals, { validateStatus: () => true });
      if (response.status !== 200) {
        setIsError(`${response.data.statusCode} ${response.data.message}`);
      } else {
        setSendSuccess(true);
        const token = response.data.access_token;
        localStorage.setItem('authorization_token', token);
        localStorage.setItem('sunsundr_store_username', (vals as LoginValues).username);
      }
    };

    if (isLogin) {
      await logIn();
    } else {
      const path = `${API_PATHS.bff}/register`;
      const response = await axios.post(path, values, { validateStatus: () => true });
      if (response.status !== 201) {
        setIsError(`${response.data.statusCode} ${response.data.message}`);
      } else {
        await logIn({ username: (values as RegisterValues).name, password: values.password });
        setSendSuccess(true);
      }
    }
    setIsLoading(false);
  };

  const title = (
    <Typography component="h1" variant="h4" align="center" mb={2}>
      {isLogin ? 'Login' : 'Register'}
    </Typography>
  );

  const switchModeButton = (
    <Button
      color="secondary"
      variant="text"
      component={RouterLink}
      to={isLogin ? '/signup' : '/signin'}
      sx={{ mt: 2 }}
    >
      {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
    </Button>
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
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        setTimeout(() => {
          window.location.href = window.location.origin;
        }, 100);
      }}
    >
      Ok
    </Button>
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          maxWidth: 480,
          minWidth: 280,
          margin: '32px auto',
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
        my: 4,
        maxWidth: 480,
        minWidth: 280,
        margin: '32px auto',
      }}
    >
      <Paper sx={{ padding: 3, paddingBottom: 3.8 }}>
        {title}
        <Formik
          initialValues={initialValues}
          validationSchema={isLogin ? LoginSchema : RegisterSchema}
          onSubmit={onSubmit}
        >
          {({ dirty, isValid, isSubmitting }) => (
            <Form autoComplete="off" hidden={sendSuccess || !!isError}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name={isLogin ? 'username' : 'name'}
                    label="Name"
                    fullWidth
                    autoComplete="username"
                    required
                  />
                </Grid>

                {!isLogin && (
                  <Grid size={{ xs: 12 }}>
                    <Field
                      component={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      autoComplete="email"
                      required
                    />
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Field
                    component={TextField}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
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
                    disabled={!dirty || isSubmitting || !isValid}
                  >
                    {isLogin ? 'Login' : 'Register'}
                  </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>{switchModeButton}</Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        {sendSuccess && (
          <>
            <div style={{ textAlign: 'center' }}>
              <TaskAltIcon color="success" sx={{ fontSize: 42 }} />
              <Typography color="success" mb={2} sx={{ textAlign: 'center', paddingBottom: '8px' }}>
                {isLogin ? 'Login successful!' : 'Registration successful!'}
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
