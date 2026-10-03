import React from 'react';
import { Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Benefit } from '../../interfaces/benefitInterfaces';
import { Percent, Tag, Gift, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

interface BenefitsCarouselProps {
  benefits: Benefit[];
}

const BENEFIT_GRADIENTS = [
  'linear-gradient(135deg, #0D9488, #0F766E)',
  'linear-gradient(135deg, #0284C7, #0369A1)',
  'linear-gradient(135deg, #10B981, #059669)',
  'linear-gradient(135deg, #6366F1, #4338CA)',
  'linear-gradient(135deg, #06B6D4, #0891B2)',
];

const BENEFIT_ICONS = [Percent, Tag, Gift, ShoppingBag];

const BenefitsCarousel: React.FC<BenefitsCarouselProps> = ({ benefits }) => {
  if (benefits.length === 0) return null;

  const shouldAutoplay = benefits.length > 1;

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
            Club de Salud & Beneficios
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
            Ahorrá con el Hospital
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
            color: 'var(--blue)',
            background: 'rgba(13, 148, 136, 0.08)',
            border: '1px solid rgba(13, 148, 136, 0.25)',
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
              boxShadow: '0 0 8px 1px rgba(13,148,136,.8)',
            }}
          />
          Red de Farmacias & Salud
        </Box>
      </Box>

      <Box
        className="rv"
        sx={{
          mt: 2.5,
          '& .swiper-pagination': {
            position: 'relative',
            mt: 1.5,
            display: benefits.length > 1 ? 'flex' : 'none',
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
          autoplay={shouldAutoplay ? { delay: 6000, disableOnInteraction: false } : false}
          loop={shouldAutoplay}
          slidesPerView={1}
          spaceBetween={16}
          pagination={benefits.length > 1 ? { clickable: true } : false}
          style={{ width: '100%' }}
        >
          {benefits.map((benefit, index) => {
            const fileUrl = benefit.file?.fileUrl ?? '';
            const hasImage = !!fileUrl;
            const GradientIcon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
            const isExclusive = !!benefit.isExclusive;

            return (
              <SwiperSlide key={benefit.id}>
                <Box
                  onClick={() => handleCardClick(benefit.url)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '155px',
                    borderRadius: '20px',
                    p: '18px 20px',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: benefit.url ? 'pointer' : 'default',
                    boxShadow: '0 12px 28px -12px rgba(0,0,0,.5)',
                    border: '1px solid rgba(255,255,255,.12)',
                    background: hasImage
                      ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${fileUrl})`
                      : BENEFIT_GRADIENTS[index % BENEFIT_GRADIENTS.length],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    textDecoration: 'none',
                    transition: 'transform .2s',
                    '&:hover': benefit.url ? {
                      transform: 'scale(1.01)',
                    } : {},
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(255,255,255,.12), transparent 40%)',
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '.06em',
                        textTransform: 'uppercase',
                        color: hasImage ? 'var(--blue-2)' : 'rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      {benefit.subtitle || 'Promo'}
                    </Typography>
                  </Box>

                  {isExclusive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 14,
                        right: 20,
                        zIndex: 2,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        background: 'rgba(13, 148, 136, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '6px',
                        backdropFilter: 'blur(3px)',
                        fontSize: '9px',
                        fontWeight: 800,
                        letterSpacing: '.04em',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)',
                      }}
                    >
                      <Sparkles size={10} color="#fff" />
                      Exclusivo
                    </Box>
                  )}

                  <Box sx={{ zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.8, mb: 1.5 }}>
                      {!hasImage && (
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,.22)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          <GradientIcon size={20} color="#fff" />
                        </Box>
                      )}
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '22px',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {benefit.name}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{
                            fontSize: '13px',
                            opacity: 0.9,
                            fontWeight: 600,
                            mt: 0.3,
                          }}
                        >
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>

                    {benefit.url && (
                      <Box
                        sx={{
                          fontSize: '13.5px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1.2,
                          background: 'rgba(0,0,0,.18)',
                          borderRadius: '12px',
                          py: 1,
                          px: 1.5,
                        }}
                      >
                        Quiero mi beneficio
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,.9)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ArrowRight size={13} color="#0f172a" strokeWidth={2.6} />
                        </Box>
                      </Box>
                    )}
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

export default BenefitsCarousel;
