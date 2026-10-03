import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { axiosInstance } from '../services';
import { advertisementTracking } from '../services/advertisementTracking';
import { FilteredAdvertisement } from '../interfaces/advertisingIntefaces';

const DEFAULT_DURATION = 2;

const sortAdvertisements = (ads: FilteredAdvertisement[]): FilteredAdvertisement[] => {
  return [...ads].sort((a, b) => {
    if (a.duration === null && b.duration === null) return 0;
    if (a.duration === null) return 1;
    if (b.duration === null) return -1;
    return b.duration - a.duration;
  });
};

interface FooterAdvertisementProps {
  height?: string | number;
  width?: string | number;
  maxWidth?: string | number;
}

const FooterAdvertisement: React.FC<FooterAdvertisementProps> = ({
  height = '300px',
  width = '80%',
  maxWidth = '1000px',
}) => {
  const [advertisements, setAdvertisements] = useState<FilteredAdvertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number>(DEFAULT_DURATION);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFooterAdvertisements = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<FilteredAdvertisement[]>(
        '/advertisements/filter/by-locations?locationNames=Footer'
      );
      if (response.data && response.data.length > 0) {
        const sortedAds = sortAdvertisements(response.data);
        setAdvertisements(sortedAds);
        setRemainingTime(sortedAds[0]?.duration ?? DEFAULT_DURATION);
      } else {
        setAdvertisements([]);
      }
    } catch (error) {
      console.error('Error al obtener la publicidad del footer:', error);
      setAdvertisements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterAdvertisements();
  }, []);

  useEffect(() => {
    if (advertisements.length === 0) return;
    const currentAd = advertisements[currentAdIndex];
    const duration = currentAd.duration ?? DEFAULT_DURATION;
    setRemainingTime(duration);
    const countdownInterval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
          return duration;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [currentAdIndex, advertisements]);

  const currentAdvertisement = advertisements[currentAdIndex];

  const handleClick = () => {
    if (!currentAdvertisement) return;
    const trackingData = {
      advertisementId: currentAdvertisement.id,
      platform: 'portal',
    };

    advertisementTracking
      .trackClick(trackingData)
      .then(() => {
        console.log(`Click tracked for advertisement ${currentAdvertisement.id}`);
        if (currentAdvertisement.url) {
          window.open(currentAdvertisement.url, '_blank');
        }
      })
      .catch((error) => {
        console.error('Error tracking ad click:', error);
        if (currentAdvertisement.url) {
          window.open(currentAdvertisement.url, '_blank');
        }
      });
  };

  if (advertisements.length === 0 || isLoading) {
    return null;
  }

  return (
    <Box
      sx={{
        marginTop: '2rem',
        width,
        maxWidth,
        height,
        display: 'flex',
        borderRadius: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundImage: currentAdvertisement?.file?.fileUrl
          ? `url(${currentAdvertisement.file.fileUrl})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: currentAdvertisement?.file?.fileUrl ? 'transparent' : '#000',
        transition: 'background-image 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleClick}
      data-testid="footer-ad-container"
    >
      {!currentAdvertisement?.file?.fileUrl && (
        <Typography variant="h6" color="white">
          Publicidad
        </Typography>
      )}
      {currentAdvertisement && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
          data-testid="countdown-timer"
        >
          {remainingTime}s
        </Typography>
      )}
    </Box>
  );
};

export default FooterAdvertisement;
