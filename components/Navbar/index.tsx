import styled from '@emotion/styled';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  InputAdornment,
  ButtonBase,
  Badge,
} from '@mui/material';
import AccountButton from './AccountButton';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState, ChangeEvent } from 'react';
import { loginWithOauthProviderAction } from '@store/actions/httpAction';
import * as Action from '@store/actionTypes';
import { jwtInfo } from '@utils/jwtInfo';
import { RootState } from '@store/store';
import { Theme } from '@mui/material';
import { JWT } from 'next-auth/jwt';

// Reverted styles for the Navbar
export const styleNew = {
  title: {
    color: '#FFF',
    fontFamily: 'Playfair Display',
    fontSize: '35px',
    fontStyle: 'italic',
    fontWeight: 600,
    lineHeight: '29.333px',
    letterSpacing: '-0.4px',
  },
};

// Reverted NavbarRoot styles
const NavbarRoot = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === 'light'
    ? {
        boxShadow: theme.shadows[3],
      }
    : {
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: 'solid' as const,
        borderBottomWidth: 1,
        boxShadow: 'none',
      }),
}));

const Navbar = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const isHomeActive = currentPath === '/';
  const { asPath } = useRouter();
  const isStoreInfoActive = asPath.startsWith('/restaurant/');
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('md'));

  // Get user login state and cart items count from Redux
  const isLogin = useSelector((state: RootState) => state.sign.isLogin);
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  // For handling session token and user role
  const [sessionToken, setSessionToken] = useState<JWT | undefined>(undefined);
  const { token } = useSelector((state: RootState) => state.sign);
  const { userRole } = jwtInfo(token as string);

  // Handle user session from next-auth
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session && session.token) {
      setSessionToken(session.token);
    }
  }, [session]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: Action.SET_SEARCH_TERM,
      payload: event.target.value,
    });
  };

  // Log in user using OAuth when session changes
  useEffect(() => {
    if (session && session.token && session.token.account && !isLogin) {
      const { provider, providerAccountId } = session.token.account;
      const { name, email, image } = session.token.user || {};

      if (provider === 'credentials') return;

      dispatch(
        loginWithOauthProviderAction(
          provider,
          providerAccountId,
          email || '',
          name || '',
          image || '',
          () => {
            console.log('Login success');
          },
          () => {
            console.log('Login failed:');
          },
        ),
      );
    }
  }, [sessionToken, isLogin]);

  return (
    <NavbarRoot theme={theme}>
      <Toolbar
        disableGutters
        sx={{
          height: 80,
          left: 0,
          pl: 3,
          pr: mobileDevice ? 3 : 5,
        }}
      >
        <NextLink href="/" passHref>
          <Box
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              marginRight: '20px',
              marginBottom: '20px',
            }}
          >
            <Image
              src="/image/Logo-Nav.png"
              width={350}
              height={75}
              alt="logo-nav"
            />
          </Box>
        </NextLink>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/" passHref>
            <Button
              sx={{
                display: 'inline-flex',
                padding: '4px 16px',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '10px',
                color: 'black',
                borderRadius: 10,
                backgroundColor: isHomeActive ? '#DBDFD0' : 'transparent',
                '&:hover': {
                  backgroundColor: '#DBDFD0',
                },
              }}
            >
              Home
            </Button>
          </Link>
          {userRole !== 'ROLE_driver' ? (
            <Link href="/restaurant/1" passHref>
              <Button
                sx={{
                  display: 'inline-flex',
                  padding: '4px 16px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'black',
                  borderRadius: 10,
                  backgroundColor: isStoreInfoActive
                    ? '#DBDFD0'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: '#DBDFD0',
                  },
                }}
              >
                Store Info
              </Button>
            </Link>
          ) : null}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {router.pathname === '/' ? (
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{
              marginRight: '20px',
              backgroundColor: '#F2F2F2',
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Box sx={{ flexGrow: 0.725 }} />
        )}

        <AccountButton isLogin={isLogin} />

        <Link href="/cart" passHref>
          <ButtonBase sx={{ padding: '10px', color: 'black' }}>
            {totalItems > 0 ? (
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon fontSize="large" />
              </Badge>
            ) : (
              <ShoppingCartIcon fontSize="large" />
            )}
          </ButtonBase>
        </Link>
      </Toolbar>
    </NavbarRoot>
  );
};

export default Navbar;
