import React, { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Checkbox,
  Divider,
  FormControlLabel,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import hotToast from '@utils/hotToast';
import GoogleSignInBtn from './UI/GoogleSignInBtn';
import FacebookSignInBtn from './UI/FacebookSignInBtn';
import { getSession, signIn } from 'next-auth/react';
import { getCsrfToken } from 'next-auth/react';
import { loginSuccess } from '@store/actions/httpAction';
import { saveState, store } from '@store/store';

interface LoginProps {
  register: () => void;
}

const Login: React.FC<LoginProps> = ({ register }) => {
  const [isLoading, setLoading] = useState(false);
  const [csrfValue, setCsrfValue] = useState<string | undefined>();
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');
  const [isForgetPasswordModalOpen, setIsForgetPasswordModalOpen] =
    useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    getCsrfToken()
      .then((token) => setCsrfValue(token))
      .catch((error) => console.error('Failed to get CSRF token', error));
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters long')
        .max(16)
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const { email, password } = values;

      try {
        const response = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/',
        });

        if (response?.ok) {
          hotToast('success', 'Login successful');
          const session = await getSession();
          if (session) {
            const jwtToken = session.token?.user?.jwt as string;
            const a = session.token;
            console.log('a:', a);

            console.log('JWT Token:', jwtToken);
            dispatch(loginSuccess(jwtToken));
          }
          await router.push('/');
        } else {
          hotToast('error', 'Invalid Email or Password');
        }
      } catch (error) {
        hotToast('error', 'Login failed');
        console.error('Login failed', error);
      } finally {
        setLoading(false);
        saveState(store.getState());
      }
    },
  });

  const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsRememberMeChecked(event.target.checked);
  };

  const handleOpenForgetPasswordModal = () => {
    setIsForgetPasswordModalOpen(true);
  };

  const handleCloseForgetPasswordModal = (
    emailSent: boolean,
    userEmail: string,
  ) => {
    setIsForgetPasswordModalOpen(false);
    if (emailSent) {
      setEmailForReset(userEmail);
      setIsResetPasswordModalOpen(true);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        minWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <input name="csrfToken" type="hidden" defaultValue={csrfValue} />
        <form onSubmit={formik.handleSubmit}>
          <Typography align="center">
            <Image src="/logo.png" height={55} width={55} alt="logo" />
          </Typography>
          <Typography color="textPrimary" variant="h4" align="center">
            WELCOME BACK, LOG IN
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ mt: 2 }}
            variant="body2"
            align="center"
          >
            Sign in to your account and make recharges, payments, and bookings
            faster
          </Typography>
          <Box sx={{ my: 4 }}>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Enter your email..."
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Enter your password..."
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Grid container alignItems="center">
              <Grid item xs={8}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRememberMeChecked}
                      onChange={handleRememberMeChange}
                    />
                  }
                  label="Remember Me"
                />
              </Grid>
              <Grid item xs={4}>
                <Typography color="textSecondary" variant="body2">
                  <Button onClick={handleOpenForgetPasswordModal}>
                    Forget password?
                  </Button>
                  <ForgetPassword
                    open={isForgetPasswordModalOpen}
                    onClose={() => setIsForgetPasswordModalOpen(false)}
                    onEmailSent={(emailSent, userEmail) =>
                      handleCloseForgetPasswordModal(emailSent, userEmail!)
                    }
                  />
                  <ResetPassword
                    open={isResetPasswordModalOpen}
                    onClose={() => setIsResetPasswordModalOpen(false)}
                    email={emailForReset}
                  />
                </Typography>
              </Grid>
            </Grid>

            <Grid sx={{ py: 3 }}>
              <LoadingButton
                loading={isLoading}
                color="error"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                LOG IN
              </LoadingButton>
            </Grid>

            <Box sx={{ mt: 0, mb: 1 }}>
              <Divider> OR </Divider>
            </Box>

            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item xs={6}>
                <GoogleSignInBtn />
              </Grid>
              <Grid item xs={6}>
                <FacebookSignInBtn />
              </Grid>
            </Grid>

            <Box>
              <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Typography>Don&apos;t have an account?</Typography>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary" variant="body2">
                    <Button onClick={register}>Sign Up</Button>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default Login;
