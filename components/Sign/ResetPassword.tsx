import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { resetpassword } from '@services/Public';
import hotToast from '@utils/hotToast';

interface ResetPasswordProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

interface ResetPasswordFormValues {
  code: string;
  newPassword: string;
}

const ResetPassword = ({ open, onClose, email }: ResetPasswordProps) => {
  const [isLoading, setLoading] = useState(false);

  // Formik for form handling with initial values and validation schema
  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      code: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Verification code is required'),
      newPassword: Yup.string()
        .min(6, 'Must be at least 6 characters long')
        .max(16, 'Must not exceed 16 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await resetpassword(email, values.code, values.newPassword);
        hotToast('success', 'Password reset successful.');
        onClose();
      } catch (error: unknown) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
          const errorResponse = error as { response?: { data?: string } };
          errorMessage =
            typeof errorResponse.response?.data === 'string'
              ? errorResponse.response.data
              : error.message;
        }
        hotToast('error', errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
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
            id="reset-password-modal-title"
            variant="h6"
            component="h2"
            align="center"
          >
            RESET PASSWORD
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
              id="code"
              label="Verification Code"
              name="code"
              autoComplete="off"
              autoFocus
              onChange={formik.handleChange}
              value={formik.values.code}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
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
              Reset Password
            </LoadingButton>
          </Box>
        </Container>
      </Fade>
    </Modal>
  );
};

export default ResetPassword;
