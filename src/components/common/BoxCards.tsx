import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import CustomButton from './CustomButton';

interface BoxCardsProps {
  title: string;
  description: string;
  isButtonActive?: boolean;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const BoxCards: React.FC<BoxCardsProps> = ({
  title,
  description,
  isButtonActive = true,
  buttonLabel = 'Ir',
  onButtonClick,
}) => {
  return (
    <Card sx={{ minHeight: '200px', position: 'relative', textAlign: 'center' }}>
      <CardContent>
        <Box
          sx={{
            width: '100%',
            height: '100px',
            backgroundColor: '#e0e0e0',
            mb: 2,
          }}
        />
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ color: 'grey' }}>
          {description}
        </Typography>

        <CustomButton
          backgroundColor="#FFEB3B"
          textColor="#000"
          disabled={!isButtonActive}
          onClick={onButtonClick}
          sx={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
          }}>
          {buttonLabel}
        </CustomButton>
      </CardContent>
    </Card>
  );
};

export default BoxCards;
