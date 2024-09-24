import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Modal,
  Fade,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { forgetpassword } from '@services/Public';
import hotToast from '@utils/hotToast';
import { AxiosError } from 'axios';

interface ForgetPasswordProps {
  open: boolean;
  onClose: () => void;
  onEmailSent?: (emailSent: boolean, userEmail?: string) => void;
}

const ForgetPassword = ({
  open,
  onClose,
  onEmailSent = () => {},
}: ForgetPasswordProps) => {
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);
      forgetpassword(values.email)
        .then(() => {
          setSubmitting(false);
          hotToast('success', 'Reset link sent to your email.');
          onEmailSent(true, values.email);
          setLoading(false);
          onClose();
        })
        .catch((error: AxiosError) => {
          setSubmitting(false);
          setLoading(false);
          if (error?.response?.status === 403) {
            hotToast('error', 'Permission denied or invalid request.');
          } else {
            hotToast('error', `Your entered email is not registered.`);
            onEmailSent(false);
          }
        });
    },
  });

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Container
          maxWidth="sm"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography
            id="transition-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            FORGET PASSWORD
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Enter your email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={formik.handleChange}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              loading={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#931F1D',
                },
              }}
            >
              Send Reset Link
            </LoadingButton>
          </Box>
        </Container>
      </Fade>
    </Modal>
  );
};

export default ForgetPassword;
