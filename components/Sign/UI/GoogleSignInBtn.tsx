import React from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Button, Box, Typography } from '@mui/material';

/**
 * handle google login action
 * google will handle the callback URL(config this in console.cloud.google.com )
 */
const handleGoogleSignIn = async () => {
  await signIn('google');
};

/**
 * Google login button Component
 */
const GoogleSignInBtn = () => {
  return (
    <Button
      onClick={() => {
        handleGoogleSignIn().catch((error) => {
          console.error('Google Sign In Error:', error);
        });
      }}
      variant="outlined"
      style={{ backgroundColor: 'white', width: '90%', maxWidth: '250px' }}
    >
      <Box display="flex" alignItems="center">
        <Image
          src="/icons/signinIcons/google-icon.png"
          alt="google Login"
          width={20}
          height={20}
        />
        <Typography> Google</Typography>
      </Box>
    </Button>
  );
};

export default GoogleSignInBtn;
