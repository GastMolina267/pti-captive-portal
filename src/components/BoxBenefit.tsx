import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Benefit } from '../interfaces/benefitInterfaces';

type Props = {
  benefit?: Benefit | null;
};

const BoxBenefit: React.FC<Props> = ({ benefit }) => {
  return benefit ? (
    <Box
      sx={{
        width: '290px',
        height: '350px',
        borderRadius: '15px',
        boxShadow: 3,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: '10px',
      }}>
      <Box
        sx={{
          width: '100%',
          height: '160px',
          backgroundImage: `url(${benefit.file?.fileUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        data-testid="background-image"
      />
      <Box
        sx={{
          flex: 1,
          padding: '16px',
          textAlign: 'center',
        }}>
        <Typography variant="h6" gutterBottom>
          {benefit.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {benefit.description}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        sx={{
          width: '90%',
          marginBottom: '16px',
          color: 'white',
        }}
        href={benefit.url || '#'}
        target="_blank"
        rel="noopener noreferrer">
        Ver Más
      </Button>
    </Box>
  ) : (
    <Box
      sx={{
        width: '290px',
        height: '350px',
        borderRadius: '15px',
        boxShadow: 3,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography variant="body2" color="text.secondary">
        Cargando beneficio...
      </Typography>
    </Box>
  );
};

export default BoxBenefit;
