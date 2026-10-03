import React from 'react';
import { Button } from '@mui/material';
import { ButtonProps } from '@mui/material/Button';

interface CustomButtonProps extends ButtonProps {
  backgroundColor?: string;
  textColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  backgroundColor = '#000',
  textColor = '#fff',
  children,
  sx = {},
  ...props
}) => {
  return (
    <Button
      {...props}
      sx={{
        backgroundColor,
        color: textColor,
        textTransform: 'none',
        borderRadius: '10px',
        padding: '10px 20px',
        ...sx,
        '&:hover': {
          backgroundColor: backgroundColor === '#000' ? '#333' : backgroundColor,
        },
      }}>
      {children}
    </Button>
  );
};

export default CustomButton;
