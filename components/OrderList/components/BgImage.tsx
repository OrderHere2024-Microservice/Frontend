import { Box } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Image from 'next/image';

const BgImage = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 'calc(100vw - 25px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/image/cart-bg.png"
        alt="Picture"
        style={{ width: '100%', height: 'auto' }}
        width={100}
        height={100}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          color: 'black',
          textAlign: 'center',
          zIndex: 2,
          fontWeight: 700,
        }}
      >
        <h1>ORDER LIST</h1>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '0px',
          left: '21%',
          display: 'flex',
          alignItems: 'center',
          zIndex: 2,
          height: '3em',
          width: 'auto',
          backgroundColor: 'white',
          fontWeight: 500,
        }}
      >
        <HomeOutlinedIcon
          sx={{ color: 'black', fontSize: 'large', marginInline: '0.5em' }}
        />
        <span style={{ color: 'black' }}>HOME ·&nbsp;</span>
        <span style={{ color: '#1976d2', marginRight: '0.5em' }}>
          ORDER LIST
        </span>
      </Box>
    </Box>
  );
};

export default BgImage;
