import React, { useState } from 'react';
import Image from 'next/image';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Yup from '@utils/yupValidation';
import hotToast from '@utils/hotToast';
import { signup } from '@services/Public';
import { loginAction } from '@store/actions/httpAction';
import GoogleSignInBtn from './UI/GoogleSignInBtn';
import FacebookSignInBtn from './UI/FacebookSignInBtn';

interface SignupProps {
  login: () => void;
}

const Signup = ({ login }: SignupProps) => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstname: Yup.string().max(255).required('First name is required'),
      lastname: Yup.string().max(255).required('Last name is required'),
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Must be at least 6 characters long')
        .max(16, 'Must not exceed 16 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      const { firstname, lastname, email, password } = values;
      setLoading(true);

      try {
        await signup(
          firstname + ' ' + lastname,
          firstname,
          lastname,
          password,
          email,
        );

        hotToast('success', 'Signup Success');
        dispatch(
          loginAction(
            email,
            password,
            () => {},
            (error) => {
              const fail = error as { response?: { status?: number } };
              setLoading(false);
              if (fail?.response?.status === 403) {
                hotToast('error', 'Invalid Email or Password');
              } else {
                const errorMessage = fail?.response?.status
                  ? `Status code: ${fail.response.status}`
                  : 'Unknown error';
                hotToast('error', `Something went wrong: ${errorMessage}`);
              }
            },
          ),
        );
      } catch (error) {
        setLoading(false);
        hotToast('error', `Something went wrong: ${String(error)}`);
      }
    },
  });

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
        <form onSubmit={formik.handleSubmit}>
          <Typography align="center">
            <Image src="/logo.png" height="55" width="55" alt="logo" />
          </Typography>
          <Typography color="textPrimary" variant="h4" align="center">
            CREATE ACCOUNT
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ mt: 2 }}
            variant="body2"
            align="center"
          >
            Please Enter your Email Address to Start your Online Application
          </Typography>
          <Box sx={{ my: 3 }}>
            <TextField
              error={Boolean(
                formik.touched.firstname && formik.errors.firstname,
              )}
              fullWidth
              helperText={formik.touched.firstname && formik.errors.firstname}
              label="First Name"
              margin="normal"
              name="firstname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.firstname}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.lastname && formik.errors.lastname)}
              fullWidth
              helperText={formik.touched.lastname && formik.errors.lastname}
              label="Last Name"
              margin="normal"
              name="lastname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.lastname}
              variant="outlined"
            />
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
            <Grid sx={{ pt: 3 }}>
              <LoadingButton
                loading={isLoading}
                disabled={formik.isSubmitting}
                color="primary"
                fullWidth
                size="large"
                variant="contained"
                onClick={() => formik.handleSubmit()}
              >
                SIGN UP
              </LoadingButton>
            </Grid>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Divider> OR </Divider>
            </Box>

            <Grid container>
              <Grid item xs={6}>
                <GoogleSignInBtn />
              </Grid>
              <Grid item xs={6}>
                <FacebookSignInBtn></FacebookSignInBtn>
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
                  <Typography>Already have an account?</Typography>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary" variant="body2">
                    <Button onClick={login}>Log in</Button>
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

export default Signup;
