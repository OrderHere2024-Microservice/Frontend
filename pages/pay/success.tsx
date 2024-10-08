import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { OrderDetail } from '@components/Payment/OrderDetail';
import Image from 'next/image';

const SuccessPage = () => {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#FEF6E9',
        padding: '20px',
        margin: 0,
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            mb: 2,
            width: '160px',
            height: '160px',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            },
          }}
        >
          <Image
            src="/icons/payment/successImg.svg"
            alt="Success"
            height={100}
            width={100}
          />
        </Box>
        <Typography
          gutterBottom
          sx={{
            color: '#474747',
            fontFamily: 'DM Sans',
            fontSize: '36px',
            fontWeight: 700,
            lineHeight: '48px',
            textShadow: '0px 2px 2px rgba(0, 0, 0, 0.15)',
          }}
        >
          Thank You
        </Typography>
        {orderId && !Array.isArray(orderId) && (
          <OrderDetail orderId={parseInt(orderId, 10)} />
        )}
        <Link href="/" passHref>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: 'primary.main',
              '&:hover': {
                opacity: 0.6,
                backgroundColor: 'primary.main',
                transition: '0.3s',
              },
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            BACK TO HOME
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default SuccessPage;
