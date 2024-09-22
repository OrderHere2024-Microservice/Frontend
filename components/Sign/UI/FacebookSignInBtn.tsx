import React from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Button, Typography, Box } from '@mui/material';

/**
 * handle facebook login action
 */
const loginWithFacebook = async () =>
  await signIn('facebook', { callbackUrl: 'http://localhost:3000' });

/**
 * Facebook Login button component
 */

const FacebookSignInBtn = () => {
  return (
    <Button
      onClick={() => {
        loginWithFacebook().catch((error) => {
          console.error('Google Sign In Error:', error);
        });
      }}
      variant="outlined"
      style={{ backgroundColor: 'white', width: '90%', maxWidth: '250px' }}
    >
      <Box display="flex" alignItems="center">
        <Image
          src="/icons/signinIcons/facebook-icon.png"
          alt="Facebook Login"
          width={20}
          height={20}
        />
        <Typography>Facebook</Typography>
      </Box>
    </Button>
  );
};

export default FacebookSignInBtn;
