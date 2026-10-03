import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FooterAdvertisement from './FooterAdvertisement';
import { axiosInstance } from '../services';
import { advertisementTracking } from '../services/advertisementTracking'; // Importamos el tracking
import { FilteredAdvertisement } from '../interfaces/advertisingIntefaces';

jest.mock('../services', () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}));

jest.mock('../services/advertisementTracking', () => ({
  advertisementTracking: {
    trackClick: jest.fn(),
  },
}));

describe('FooterAdvertisement', () => {
  const mockAd: FilteredAdvertisement = {
    id: 'ad1',
    name: 'Ad 1',
    url: 'http://example.com/ad1',
    duration: 5,
    file: {
      id: 'file1',
      name: 'File 1',
      fileUrl: 'http://example.com/ad1.jpg',
    },
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (axiosInstance.get as jest.Mock).mockResolvedValue({ data: [mockAd] });
    (advertisementTracking.trackClick as jest.Mock).mockResolvedValue({});

    jest.spyOn(globalThis, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('renderiza el anuncio correctamente después de cargar los datos', async () => {
    await act(async () => {
      render(<FooterAdvertisement />);
    });

    const timer = await screen.findByTestId('countdown-timer');
    expect(timer).toHaveTextContent('5s');

    const adContainer = screen.getByTestId('footer-ad-container');
    expect(adContainer).toHaveStyle({
      backgroundImage: expect.stringContaining(mockAd.file.fileUrl),
    });
  });

  test('actualiza el contador de tiempo correctamente', async () => {
    await act(async () => {
      render(<FooterAdvertisement />);
    });

    await screen.findByTestId('countdown-timer');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('countdown-timer')).toHaveTextContent('4s');
    });
  });

  test('al hacer click se trackea el evento y abre la url', async () => {
    await act(async () => {
      render(<FooterAdvertisement />);
    });

    const adContainer = await screen.findByTestId('footer-ad-container');

    fireEvent.click(adContainer);

    expect(advertisementTracking.trackClick).toHaveBeenCalledWith({
      advertisementId: mockAd.id,
      platform: 'portal',
    });

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(mockAd.url, '_blank');
    });
  });

  test('no renderiza nada (return null) cuando no hay anuncios', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValue({ data: [] });

    await act(async () => {
      render(<FooterAdvertisement />);
    });
    await waitFor(() => {
      const adContainer = screen.queryByTestId('footer-ad-container');
      expect(adContainer).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/Publicidad/i)).not.toBeInTheDocument();
  });
});
