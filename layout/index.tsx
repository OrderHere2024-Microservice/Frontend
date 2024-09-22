import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const LayoutRoot = styled('div')(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  paddingTop: 50,
  paddingBottom: 0,
  minHeight: '100%',
}));
const Layout = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <LayoutRoot>
      {Array.isArray(children) && children[0] ? children[0] : null}
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          minHeight: '100%',
          flexGrow: 1,
          py: 4,
        }}
      >
        {Array.isArray(children) && children[1] ? children[1] : null}
      </Box>
    </LayoutRoot>
  );
};

export default Layout;
