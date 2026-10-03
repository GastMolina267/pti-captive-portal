import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import '@testing-library/jest-dom';
import AdvertisementCarousel from './AdvertisementCarousel';
import { Advertisement } from '../interfaces/advertisingIntefaces';

jest.mock('swiper/react', () => {
  type SwiperProps = PropsWithChildren<Record<string, unknown>>;
  type SwiperSlideProps = PropsWithChildren<unknown>;
  return {
    Swiper: ({ children, ...props }: SwiperProps) => (
      <div data-testid="swiper" data-swiper-props={JSON.stringify(props)}>
        {children}
      </div>
    ),
    SwiperSlide: ({ children }: SwiperSlideProps) => (
      <div data-testid="swiper-slide">{children}</div>
    ),
  };
});

jest.mock('swiper/modules', () => ({
  Autoplay: jest.fn(),
  Pagination: jest.fn(),
}));

jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('./BoxAdvertisement', () => {
  return function MockBoxAdvertisement({ advertising }: { advertising: Advertisement }) {
    return <div data-testid="box-advertisement">{advertising?.name}</div>;
  };
});

jest.mock('../services/axiosInstance', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(),
  },
}));

describe('AdvertisementCarousel', () => {
  const mockAds: Advertisement[] = [
    {
      id: '1',
      name: 'Ad 1',
      file: undefined,
      url: '',
      description: 'Description 1',
      showPortal: true,
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Ad 2',
      file: { fileUrl: '' },
      url: '',
      description: 'Description 2',
      showPortal: false,
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Ad 3',
      file: undefined,
      url: '',
      description: 'Description 3',
      showPortal: true,
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
  ];

  it('renderiza el componente correctamente con anuncios', () => {
    render(<AdvertisementCarousel advertisements={mockAds} />);

    const swiper = screen.getByTestId('swiper');
    expect(swiper).toBeInTheDocument();

    const swiperProps = JSON.parse(swiper.dataset.swiperProps || '{}');
    expect(swiperProps.loop).toBe(true);
    expect(swiperProps.spaceBetween).toBe(16);
    expect(swiperProps.slidesPerView).toBe(1);
    expect(swiperProps.autoplay).toEqual(
      expect.objectContaining({
        delay: 5000,
        disableOnInteraction: false,
      }),
    );

    const slides = screen.getAllByTestId('swiper-slide');
    expect(slides).toHaveLength(3);

    expect(screen.getByText('Ad 1')).toBeInTheDocument();
    expect(screen.getByText('Ad 2')).toBeInTheDocument();
    expect(screen.getByText('Ad 3')).toBeInTheDocument();
  });

  it('renderiza el carrusel vacío cuando no hay anuncios', () => {
    render(<AdvertisementCarousel advertisements={[]} />);

    expect(screen.getByTestId('swiper')).toBeInTheDocument();

    const slides = screen.queryAllByTestId('swiper-slide');
    expect(slides).toHaveLength(0);

    expect(screen.queryByText('Ad 1')).not.toBeInTheDocument();
  });

  it('utiliza los módulos Autoplay y Pagination', () => {
    render(<AdvertisementCarousel advertisements={mockAds} />);

    const swiper = screen.getByTestId('swiper');
    const swiperProps = JSON.parse(swiper.dataset.swiperProps || '{}');

    expect(swiperProps.modules).toBeDefined();
  });
});
