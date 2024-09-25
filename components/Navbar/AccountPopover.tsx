import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSession } from 'next-auth/react';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import { logoutAction } from '@store/actions/signAction';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { jwtInfo } from '@utils/jwtInfo';
import { getUserProfile } from '@services/Profile';
import { RootState } from '@store/store';

const AccountPopover = ({
  anchorEl,
  onClose,
  open,
  ...other
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  open: boolean;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('headImgUrl');

  const { data: session } = useSession();

  const { token } = useSelector((state: RootState) => state.sign);
  const { userRole } = jwtInfo(token as string);
  const { isLogin } = useSelector((state: RootState) => state.sign);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispatch(logoutAction());
    onClose();
    await router.push('/');
  };

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      const data = response.data as {
        username: string;
        avatarUrl: string;
      };
      setUsername(data.username);
      setAvatarUrl(data.avatarUrl);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchProfile().catch((error) =>
        console.error('Error fetching profile:', error),
      );
    }
  }, [session, isLogin]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      keepMounted
      onClose={onClose}
      open={open}
      transitionDuration={0}
      {...other}
    >
      <NextLink href="/profile" passHref>
        <Box
          sx={{
            alignItems: 'center',
            p: 2,
            display: 'flex',
            cursor: 'pointer',
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{
              height: 40,
              width: 40,
            }}
          />
          <Box
            sx={{
              ml: 1,
            }}
          >
            <Typography variant="body1">{username}</Typography>
            <Typography color="textSecondary" variant="body2">
              {userRole ? userRole.slice(5) : 'Role_visitor'}
            </Typography>
          </Box>
        </Box>
      </NextLink>
      <Divider />
      <Box sx={{ my: 1 }}>
        {userRole !== 'ROLE_driver' && (
          <NextLink href="/order-management" passHref>
            <MenuItem>
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1">
                    {userRole === 'ROLE_sys_admin'
                      ? 'Order Management'
                      : 'Order History'}
                  </Typography>
                }
              />
            </MenuItem>
          </NextLink>
        )}
        <Divider />
        <NextLink href="/profile" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Settings</Typography>}
            />
          </MenuItem>
        </NextLink>
        <Divider />
        <NextLink href="/" passHref>
          <MenuItem
            onClick={() => {
              handleLogout().catch((error) =>
                console.error('Error during logout:', error),
              );
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1">Logout</Typography>}
            />
          </MenuItem>
        </NextLink>
      </Box>
    </Popover>
  );
};

export default AccountPopover;
