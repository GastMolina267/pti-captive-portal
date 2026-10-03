import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  CardMedia,
  Button,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { BaseTrackingData, RetentionTrackingData } from '../../services/advertisementTracking';

interface TrackingFunctions {
  trackView: (data: BaseTrackingData) => Promise<void>;
  trackClick: (data: BaseTrackingData) => Promise<void>;
  trackViewMore: (data: BaseTrackingData) => Promise<void>;
  trackRetention: (data: RetentionTrackingData) => Promise<void>;
}

interface AdvertisementDialogProps {
  open: boolean;
  onClose: () => void;
  advertisement: {
    id?: string;
    description?: string;
    file?: { fileUrl: string };
    url?: string;
    name?: string;
  } | null;
  userId?: string;
  zoneId?: string | null;
  tracking: TrackingFunctions;
}

const getUserLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  if (!navigator.geolocation) {
    console.warn('La geolocalización no es soportada por este navegador.');
    return null;
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn(`Error obteniendo la localización: ${error.message}`);
        resolve(null);
      },
      { timeout: 2000 },
    );
  });
};

const AdvertisementDialog: React.FC<AdvertisementDialogProps> = ({
  open,
  onClose,
  advertisement,
  userId,
  zoneId,
  tracking,
}) => {
  const [viewStartTime, setViewStartTime] = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    if (open && advertisement?.id) {
      const trackingData = {
        advertisementId: advertisement.id,
        platform: 'portal',
        ...(userId && { userId }),
        ...(zoneId && { zoneId }),
        ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng }),
      };
      tracking.trackView(trackingData);
      setViewStartTime(new Date());
    }
  }, [open, advertisement?.id, userLocation, tracking, userId, zoneId]);

  const handleClose = () => {
    if (viewStartTime && advertisement?.id) {
      const trackingData = {
        advertisementId: advertisement.id,
        platform: 'portal',
        ...(userId && { userId }),
        ...(zoneId && { zoneId }),
        ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng }),
        startTime: viewStartTime,
        endTime: new Date(),
      };
      tracking.trackRetention(trackingData);
    }
    setViewStartTime(null);
    onClose();
  };

  const handleContentClick = () => {
    if (advertisement?.id) {
      const trackingData = {
        advertisementId: advertisement.id,
        platform: 'portal',
        ...(userId && { userId }),
        ...(zoneId && { zoneId }),
        ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng }),
      };
      tracking.trackClick(trackingData);
    }
  };

  const handleViewMoreClick = () => {
    if (advertisement?.id) {
      const trackingData = {
        advertisementId: advertisement.id,
        platform: 'portal',
        ...(userId && { userId }),
        ...(zoneId && { zoneId }),
        ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng }),
      };
      tracking.trackViewMore(trackingData);
    }
  };

  if (!advertisement) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="body"
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      PaperProps={{
        sx: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
        },
      }}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textTransform: 'uppercase',
              textAlign: 'center',
              flexGrow: 1,
            }}>
            Publicidad
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'text.secondary',
              position: 'absolute',
              right: 8,
              '&:hover': {
                color: 'error.main',
              },
            }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
        }}>
        {advertisement.description && (
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              marginBottom: '16px',
              width: '100%',
              color: '#757575',
              borderBottom: '1px dashed #ccc',
              paddingBottom: '8px',
            }}>
            {advertisement.description}
          </Typography>
        )}
        {advertisement.file?.fileUrl && (
          <Box onClick={handleContentClick} sx={{ cursor: 'pointer' }}>
            {new RegExp(/\.(mp4|webm|ogg)$/).exec(advertisement.file.fileUrl) ? (
              <Box sx={{ maxWidth: '100%', maxHeight: '400px', position: 'relative' }}>
                <video
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    borderRadius: '5px',
                  }}>
                  <source src={advertisement.file.fileUrl} type="video/mp4" />
                  <source src={advertisement.file.fileUrl} type="video/webm" />
                  <source src={advertisement.file.fileUrl} type="video/ogg" />
                  Tu navegador no soporta la reproducción de videos.
                </video>
              </Box>
            ) : (
              <CardMedia
                component="img"
                sx={{ maxHeight: '400px', width: '100%', borderRadius: '5px' }}
                image={advertisement.file.fileUrl}
                alt={advertisement.name}
              />
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          component="a"
          href={advertisement.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleViewMoreClick}
          sx={{
            textDecoration: 'none',
            fontWeight: 'bold',
            color: '#636363',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '2px solid',
            borderColor: '#636363',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: '#fff',
              borderColor: 'primary.main',
            },
          }}>
          Ver Más
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvertisementDialog;