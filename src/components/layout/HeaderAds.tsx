import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Advertisement } from '../../interfaces/advertisingIntefaces';
import { advertisementTracking } from '../../services/advertisementTracking';
import { axiosInstance } from '../../services';
import { HeartPulse, Activity, ShieldCheck, Sparkles, PlusCircle } from 'lucide-react';
import 'swiper/css';

const AD_GRADIENTS = [
  'linear-gradient(135deg, #0D9488, #0F766E)',
  'linear-gradient(135deg, #0284C7, #0369A1)',
  'linear-gradient(135deg, #10B981, #059669)',
  'linear-gradient(135deg, #6366F1, #4338CA)',
  'linear-gradient(135deg, #0E7490, #155E75)',
];

const AD_ICONS = [HeartPulse, Activity, ShieldCheck, Sparkles, PlusCircle];

const isPointInPolygon = (
  point: { lat: number; lng: number },
  polygon: Array<[number, number]>,
): boolean => {
  let inside = false;
  const x = point.lat;
  const y = point.lng;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

const getUserLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  if (!navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(null),
      { timeout: 2000 },
    );
  });
};

const isUserInZone = async (
  userLocation: { lat: number; lng: number } | null,
  pointsList: string,
) => {
  if (!userLocation) return false;
  try {
    const polygon: Array<[number, number]> = JSON.parse(pointsList);
    return isPointInPolygon(userLocation, polygon);
  } catch {
    return false;
  }
};

const isAdWithinDateRange = (start: string, end: string): boolean => {
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
};

const isAdWithinSchedule = (
  schedules?: Array<{ day: number; startTime: string; endTime: string }>,
): boolean => {
  if (!schedules || schedules.length === 0) return true;

  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return schedules.some(({ day, startTime, endTime }) => {
    if (day !== currentDay) return false;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const isWithinSameDay =
      (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
      (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute));

    const isCrossingMidnight =
      currentHour > startHour ||
      (currentHour === startHour && currentMinute >= startMinute) ||
      currentHour < endHour ||
      (currentHour === endHour && currentMinute <= endMinute);

    return startHour < endHour ? isWithinSameDay : isCrossingMidnight;
  });
};

const HeaderAds: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const userLocation = await getUserLocation();
        const { data: dataAdvertisements } = await axiosInstance.get<Advertisement[]>(
          '/advertisements',
        );

        const adsWithZones = dataAdvertisements.filter(
          (ad) =>
            ad.showPortal &&
            isAdWithinDateRange(ad.start, ad.end) &&
            isAdWithinSchedule(ad.schedules) &&
            ad.zones &&
            ad.zones.length > 0,
        );

        const filteredAds: Advertisement[] = [];
        if (userLocation) {
          for (const ad of adsWithZones) {
            if (ad.zones && ad.zones.length > 0) {
              const isInZoneArray = await Promise.all(
                ad.zones.map((zone) => isUserInZone(userLocation, zone.pointsList)),
              );
              if (isInZoneArray.some(Boolean)) {
                filteredAds.push(ad);
              }
            }
          }
        } else {
          filteredAds.push(...adsWithZones.slice(0, 5));
        }

        setAdvertisements(filteredAds);
      } catch (error) {
        console.error('Error fetching header ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const handleAdClick = (ad: Advertisement) => {
    const trackingData = {
      advertisementId: ad.id,
      platform: 'portal',
    };
    advertisementTracking
      .trackClick(trackingData)
      .then(() => console.log(`Click tracked for advertisement ${ad.id}`))
      .catch((error: unknown) => console.error('Error tracking ad click:', error));
  };

  if (loading || advertisements.length === 0) {
    return null;
  }

  const shouldAutoplay = advertisements.length > 1;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px 11px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          height: '84px',
          position: 'relative',
          borderRadius: '20px',
        }}
      >
        <Swiper
          modules={[Autoplay]}
          autoplay={shouldAutoplay ? { delay: 5000, disableOnInteraction: false } : false}
          loop={shouldAutoplay}
          slidesPerView={1}
          spaceBetween={10}
          style={{ width: '100%', height: '100%' }}
        >
          {advertisements.map((ad, index) => {
            const hasImage = !!ad.file?.fileUrl;
            const fileUrl = ad.file?.fileUrl ?? '';
            const GradientIcon = AD_ICONS[index % AD_ICONS.length];

            return (
              <SwiperSlide key={ad.id}>
                <Box
                  component={ad.url ? 'a' : 'div'}
                  href={ad.url ?? undefined}
                  target={ad.url ? '_blank' : undefined}
                  rel={ad.url ? 'noopener noreferrer' : undefined}
                  onClick={() => handleAdClick(ad)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    height: '84px',
                    padding: '18px',
                    borderRadius: '20px',
                    color: '#fff',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,.14)',
                    boxShadow: '0 10px 24px -10px rgba(0,0,0,.5)',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    background: hasImage
                      ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${fileUrl})`
                      : AD_GRADIENTS[index % AD_GRADIENTS.length],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform .2s',
                    '&:active': {
                      transform: 'scale(.98)',
                    },
                  }}
                >
                  {!hasImage && (
                    <Box
                      sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,.22)',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <GradientIcon size={24} color="#fff" />
                    </Box>
                  )}

                  <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '15px',
                        fontWeight: 700,
                        lineHeight: 1.2,
                      }}
                    >
                      {ad.name}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '12.5px',
                        opacity: 0.9,
                        fontWeight: 500,
                        marginTop: '4px',
                        lineHeight: 1.4,
                      }}
                    >
                      {ad.description}
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </Box>
  );
};

export default HeaderAds;
