import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { benefitService } from '../services';
import { Benefit } from '../interfaces/benefitInterfaces';
import { useThemeMode } from '../themes/ThemeManager';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import BenefitsSection from '../components/home/BenefitsSection';
import BenefitsCarousel from '../components/home/BenefitsCarousel';
import UrgencyTimer from '../components/home/UrgencyTimer';
import FinalCTA from '../components/home/FinalCTA';

const isBenefitWithinDateRange = (start: string, end: string): boolean => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  return now >= startDate && now <= endDate;
};

const useReveal = (deps: React.DependencyList) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.rv').forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    );

    const elements = document.querySelectorAll('.rv');
    elements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInViewport) {
        el.classList.add('in');
      } else {
        (el as HTMLElement).style.transitionDelay = `${Math.min(i % 5, 4) * 45}ms`;
        observer.observe(el);
      }
    });

    const fallbackTimeout = setTimeout(() => {
      if (!document.querySelector('.rv.in')) {
        elements.forEach((e) => {
          (e as HTMLElement).style.transitionDelay = '0ms';
          e.classList.add('in');
        });
      }
    }, 700);

    return () => {
      clearTimeout(fallbackTimeout);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const Home: React.FC = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const { mode } = useThemeMode();

  useReveal([benefits, mode]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataBenefits = await benefitService.getBenefits();
      const filteredBenefits = dataBenefits.filter(
        (b) => isBenefitWithinDateRange(b.start, b.end)
      );
      setBenefits(filteredBenefits);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'clip',
      }}
    >
      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      {benefits.length > 0 && <BenefitsCarousel benefits={benefits} />}
      <UrgencyTimer />
      <FinalCTA />
    </Box>
  );
};

export default Home;