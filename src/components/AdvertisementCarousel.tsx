import React from 'react';
import { Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Advertisement } from '../interfaces/advertisingIntefaces';
import { advertisementTracking } from '../services/advertisementTracking';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

interface AdvertisementCarouselProps {
  advertisements: Advertisement[];
}

const AD_GRADIENTS = [
  'linear-gradient(135deg, #b45309, #7c2d12)',
  'linear-gradient(135deg, #1E88E5, #1d4ed8)',
  'linear-gradient(135deg, #7C3AED, #a21caf)',
  'linear-gradient(135deg, #059669, #0d9488)',
  'linear-gradient(135deg, #334155, #0f172a)',
];

const AdvertisementCarousel: React.FC<AdvertisementCarouselProps> = ({ advertisements }) => {
  const shouldAutoplay = advertisements.length > 1;

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

  const getFileType = (url: string): 'image' | 'video' | 'unknown' => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext ?? '')) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(ext ?? '')) return 'video';
    return 'unknown';
  };

  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2.5, sm: 3, md: 5 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          gap: 1.5,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box>
          <Typography className="eyebrow rv" component="span">
            Beneficios cerca tuyo
          </Typography>
          <Typography
            component="h2"
            className="rv"
            sx={{
              fontSize: { xs: '24px', sm: '27px' },
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              mt: 1.5,
            }}
          >
            Promos de hoy
          </Typography>
        </Box>
        <Box
          className="rv"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.8,
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            background: 'var(--surface)',
            border: '1px solid var(--stroke)',
            py: 0.8,
            px: 1.4,
            borderRadius: '999px',
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--blue)',
              boxShadow: '0 0 8px 1px rgba(61,169,252,.8)',
            }}
          />
          Publicidad
        </Box>
      </Box>

      <Box
        className="rv"
        sx={{
          mt: 2.5,
          '& .swiper-pagination': {
            position: 'relative',
            mt: 1.5,
            display: advertisements.length > 1 ? 'flex' : 'none',
            justifyContent: 'center',
            gap: '5px',
          },
          '& .swiper-pagination-bullet': {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--stroke-2)',
            opacity: 1,
            transition: '.3s',
          },
          '& .swiper-pagination-bullet-active': {
            background: 'var(--blue)',
            width: '16px',
            borderRadius: '3px',
          },
        }}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={shouldAutoplay ? { delay: 5000, disableOnInteraction: false } : false}
          loop={shouldAutoplay}
          slidesPerView={1}
          spaceBetween={16}
          pagination={advertisements.length > 1 ? { clickable: true } : false}
          style={{ width: '100%' }}
        >
          {advertisements.map((ad, index) => {
            const fileUrl = ad.file?.fileUrl ?? '';
            const fileType = getFileType(fileUrl);
            const hasImage = fileType === 'image';
            const hasVideo = fileType === 'video';

            return (
              <SwiperSlide key={ad.id}>
                <Box
                  component={ad.url ? 'a' : 'div'}
                  href={ad.url ?? undefined}
                  target={ad.url ? '_blank' : undefined}
                  rel={ad.url ? 'noopener noreferrer' : undefined}
                  onClick={() => handleAdClick(ad)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '155px',
                    borderRadius: '20px',
                    p: hasImage || hasVideo ? 0 : '18px 20px',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 12px 28px -12px rgba(0,0,0,.5)',
                    border: '1px solid rgba(255,255,255,.12)',
                    background: hasImage || hasVideo ? '#000' : AD_GRADIENTS[index % AD_GRADIENTS.length],
                    textDecoration: 'none',
                    transition: 'transform .2s',
                    '&:hover': {
                      transform: 'scale(1.01)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(255,255,255,.12), transparent 40%)',
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 14,
                      right: 18,
                      zIndex: 2,
                      fontSize: '8.5px',
                      fontWeight: 800,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      opacity: 0.85,
                      color: '#fff',
                      ...(hasImage || hasVideo
                        ? {
                          background: 'rgba(0,0,0,.55)',
                          px: 1,
                          py: 0.4,
                          borderRadius: '6px',
                          backdropFilter: 'blur(3px)',
                        }
                        : {}),
                    }}
                  >
                    Publicidad
                  </Typography>

                  {hasImage && (
                    <img
                      src={fileUrl}
                      alt={ad.name || 'Publicidad'}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      width="600"
                      height="155"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '20px',
                      }}
                    />
                  )}

                  {hasVideo && (
                    <video
                      src={fileUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '20px',
                      }}
                    />
                  )}

                  {!hasImage && !hasVideo && (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8 }}>
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: '13px',
                            background: 'rgba(255,255,255,.22)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          <Typography sx={{ fontSize: '20px' }}>📢</Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.15 }}>
                            {ad.name || 'Promoción'}
                          </Typography>
                          {ad.description && (
                            <Typography sx={{ fontSize: '12px', opacity: 0.85, fontWeight: 600 }}>
                              {ad.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          fontSize: '14.5px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1.2,
                          background: 'rgba(0,0,0,.18)',
                          borderRadius: '12px',
                          py: 1.2,
                          px: 1.8,
                        }}
                      >
                        {ad.description || 'Ver más'}
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,.9)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ArrowRight size={14} color="#0f172a" strokeWidth={2.6} />
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      <Typography
        className="rv"
        sx={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--muted-2)',
          mt: 2,
          fontWeight: 500,
        }}
      >
        Sumá tu farmacia o servicio de salud a Vitalia y llegá a miles de pacientes.
      </Typography>
    </Box>
  );
};

export default AdvertisementCarousel;
