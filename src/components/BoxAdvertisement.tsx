import React from 'react';
import { Box } from '@mui/material';
import { Advertisement } from '../interfaces/advertisingIntefaces';

type Props = {
  advertising?: Advertisement | null;
}

const BoxAdvertisement: React.FC<Props> = ({ advertising }) => {

  const getFileTypeFromUrl = (url: string): 'image' | 'video' | 'unknown' => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension ?? '')) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension ?? '')) return 'video';
    return 'unknown';
  };

  const renderMedia = () => {
    const fileUrl = advertising?.file?.fileUrl ?? '';
    const fileType = getFileTypeFromUrl(fileUrl);

    if (fileType === 'image') {
      return (
        <img
          src={fileUrl}
          alt="Publicidad"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '15px',
            objectFit: 'cover',
          }}
        />
      );
    } else if (fileType === 'video') {
      return (
        <video
          src={fileUrl}
          autoPlay
          loop
          muted
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '15px',
            objectFit: 'cover',
          }}
        />
      );
    } else {
      console.warn('Tipo de archivo no soportado:', fileUrl);
      return null;
    }
  };

  return advertising ? (
    <a
      href={advertising.url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          width: '290px',
          height: '100px',
          backgroundColor: '#000',
          borderRadius: '15px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}>
        {renderMedia()}
      </Box>
    </a>
  ) : (
    <Box
      sx={{
        width: '290px',
        height: '100px',
        backgroundColor: '#ccc',
        borderRadius: '15px',
      }}
    />
  );
};

export default BoxAdvertisement;
