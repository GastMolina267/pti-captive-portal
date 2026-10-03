import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          p: 2,
          width: '100%',
          maxWidth: 500,
          bgcolor: 'background.paper',
          color: 'text.primary',
        },
      }}>
      <DialogTitle sx={{ color: 'text.primary', fontWeight: theme.typography.fontWeightBold }}>
        {title}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: 'white',
            textTransform: 'none',
            backgroundColor: 'text.secondary',
            '&:hover': {
              backgroundColor: '#475569',
            },
            mr: 2,
            px: 4,
            py: 1,
          }}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            px: 4,
            py: 1,
            textTransform: 'none',
          }}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
