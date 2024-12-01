import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Box, ButtonBase } from '@mui/material';
import AccountPopover from './AccountPopover';
import { signIn } from 'next-auth/react';
import { getUserProfile } from '@services/Profile';

const AccountButton = ({ isLogin }: { isLogin: boolean }) => {
  const anchorRef = useRef(null);
  const [openPopover, setOpenPopover] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('headImgUrl');

  //state to manage signIn dialog
  const handleButtonClick = () => {
    if (!isLogin) {
      signIn('keycloak').catch((error) => console.error(error));
    } else {
      setOpenPopover(isLogin);
    }
  };

  const fetchProfile = async () => {
    try {
      if (!isLogin) {
        return;
      }
      const response = await getUserProfile();
      setAvatarUrl((response.data as { avatarUrl: string }).avatarUrl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchProfile().catch((error) => console.error(error));
    }
  }, [isLogin]);

  return (
    <>
      {/* Open the AccountPopover Dialog is isLogin is true  */}
      {isLogin && (
        <AccountPopover
          anchorEl={anchorRef.current}
          onClose={() => setOpenPopover(false)}
          open={openPopover}
        />
      )}

      <Box
        component={ButtonBase}
        onClick={() => handleButtonClick()}
        ref={anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: 2,
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40,
          }}
          src={isLogin && avatarUrl ? avatarUrl : ''}
        />
      </Box>
      {isLogin && (
        <AccountPopover
          anchorEl={anchorRef.current}
          onClose={() => setOpenPopover(false)}
          open={openPopover}
        />
      )}
    </>
  );
};

export default AccountButton;
