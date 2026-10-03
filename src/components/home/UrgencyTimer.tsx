import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Clock, Download, Check, Wifi } from 'lucide-react';

const TOTAL_SECONDS = 540;
const CIRCUMFERENCE = 2 * Math.PI * 52;
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.vitalia.app';

const pad = (n: number) => String(n).padStart(2, '0');

const UrgencyTimer: React.FC = () => {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [tickMin, setTickMin] = useState(false);
  const [tickSec, setTickSec] = useState(false);
  const prevMin = useRef('09');
  const prevSec = useRef('00');

  const minutes = pad(Math.floor(remaining / 60));
  const seconds = pad(remaining % 60);
  const isCritical = remaining <= 60;
  const progress = CIRCUMFERENCE * (1 - remaining / TOTAL_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (minutes !== prevMin.current) {
      setTickMin(true);
      prevMin.current = minutes;
      setTimeout(() => setTickMin(false), 400);
    }
    if (seconds !== prevSec.current) {
      setTickSec(true);
      prevSec.current = seconds;
      setTimeout(() => setTickSec(false), 400);
    }
  }, [minutes, seconds]);

  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2.5, sm: 3, md: 5 },
        py: { xs: 1.2, sm: 1.5 },
      }}
    >
      <Box
        className="rv"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--r-lg)',
          border: '1px solid',
          borderColor: isCritical ? 'rgba(244,63,94,.6)' : 'var(--stroke-2)',
          background: 'var(--urge-bg)',
          p: { xs: '26px 22px', md: '36px 40px' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          gap: { xs: 2.2, md: 5.5 },
          transition: 'border-color .45s, box-shadow .45s, background .45s',
          animation: isCritical ? 'critPulse 1.5s ease-in-out infinite' : 'none',
          maxWidth: { md: '900px' },
          mx: { md: 'auto' },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -70,
            right: -50,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: isCritical
              ? 'radial-gradient(circle, rgba(244,63,94,.22), transparent 64%)'
              : 'radial-gradient(circle, rgba(13,148,136,.22), transparent 64%)',
            filter: 'blur(16px)',
            opacity: isCritical ? 1 : 0.7,
            transition: 'opacity .45s',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, flex: { md: 1 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              background: isCritical ? 'rgba(244,63,94,.16)' : 'rgba(13,148,136,.14)',
              border: '1px solid',
              borderColor: isCritical ? 'rgba(244,63,94,.36)' : 'rgba(13,148,136,.36)',
              color: isCritical ? '#FDA4AF' : 'var(--blue-2, #14B8A6)',
              py: 0.8,
              px: 1.6,
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
            }}
          >
            <Clock size={15} />
            Tiempo de cortesía en sala
          </Box>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '24px', sm: '27px' },
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
              mt: 1.8,
            }}
          >
            Tu conexión tiene límite
          </Typography>

          <Typography
            sx={{
              fontSize: '14.5px',
              lineHeight: 1.55,
              color: 'var(--muted)',
              mt: 1.2,
              fontWeight: 500,
            }}
          >
            Para continuar navegando sin interrupciones y recibir alertas de tu turno, renová tu conexión desde la app oficial del hospital.
          </Typography>

          <Button
            component="a"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Download size={22} strokeWidth={2.4} />}
            sx={{
              mt: 2.5,
              display: { xs: 'flex', md: 'inline-flex' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.2,
              width: { xs: '100%', md: 'auto' },
              background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
              color: '#fff',
              py: 2.2,
              px: { xs: 2.8, md: 4.2 },
              borderRadius: '16px',
              fontSize: '17px',
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: '0 12px 30px -8px rgba(13,148,136,.6), inset 0 1px 0 rgba(255,255,255,.28)',
              '&:hover': {
                background: 'linear-gradient(180deg, var(--blue), var(--blue-deep))',
                transform: 'translateY(-1px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                animation: 'pulse 2.6s ease-out infinite',
              },
            }}
          >
            Descargar la app de salud
          </Button>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: 0.8,
              mt: 1.4,
              fontSize: '11.5px',
              color: 'var(--muted)',
              fontWeight: 600,
            }}
          >
            <Check size={14} color="#10B981" />
            Renová tu conexión de cortesía en segundos
          </Box>
        </Box>

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.8,
            flexShrink: 0,
          }}
        >
          <Box sx={{ position: 'relative', width: 190, height: 190 }}>
            <svg
              width="190"
              height="190"
              viewBox="0 0 120 120"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={isCritical ? '#F43F5E' : '#0D9488'} />
                  <stop offset="1" stopColor={isCritical ? '#E11D48' : '#14B8A6'} />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="var(--stroke)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE.toFixed(2)}
                strokeDashoffset={progress.toFixed(2)}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke .5s' }}
              />
            </svg>

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  fontSize: '46px',
                  fontWeight: 800,
                  color: isCritical ? '#F43F5E' : 'var(--ink)',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'baseline',
                  transition: 'color .4s',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    animation: tickMin ? 'tick .4s cubic-bezier(.22,1,.36,1)' : 'none',
                  }}
                >
                  {minutes}
                </Box>
                <Box
                  component="span"
                  sx={{ fontStyle: 'normal', opacity: 0.45, mx: '1px' }}
                >
                  :
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    animation: tickSec ? 'tick .4s cubic-bezier(.22,1,.36,1)' : 'none',
                  }}
                >
                  {seconds}
                </Box>
              </Box>
              <Typography
                sx={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.12em',
                  color: isCritical ? '#F43F5E' : 'var(--muted)',
                  mt: 0.8,
                  transition: 'color .4s',
                }}
              >
                {isCritical ? '¡últimos segundos!' : 'tiempo restante'}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.8,
              fontSize: '12.5px',
              color: 'var(--muted)',
              fontWeight: 600,
            }}
          >
            <Wifi size={15} color="#10B981" />
            Tu conexión de cortesía está activa
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UrgencyTimer;
