import React, { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = ({ onClose }: { onClose: () => void }) => {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }}>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              backgroundColor: '#d32f2f',
              color: 'rgba(255,255,255,1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface SignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SignDialog = ({ children, isOpen, onClose }: SignDialogProps) => {
  return (
    <BootstrapDialog
      open={isOpen}
      onClose={onClose}
      sx={{
        '.MuiDialog-paper': {
          backgroundColor: '#FEF6E9',
        },
      }}
    >
      <BootstrapDialogTitle onClose={onClose} />
      <DialogContent>{children}</DialogContent>
    </BootstrapDialog>
  );
};

export default SignDialog;
