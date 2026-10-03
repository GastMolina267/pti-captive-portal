import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoxAdvertisement from './BoxAdvertisement';
import { Advertisement } from '../interfaces/advertisingIntefaces';

describe('BoxAdvertisement', () => {
  const baseAd: Omit<Advertisement, 'file'> & { file?: { fileUrl: string } } = {
    id: '1',
    name: 'Test Ad',
    description: 'Test Description',
    showPortal: true,
    start: '2023-01-01T00:00:00.000Z',
    end: '2023-12-31T23:59:59.999Z',
    url: 'http://example.com',
  };

  test('renderiza una imagen cuando fileUrl es de tipo imagen', () => {
    const ad: Advertisement = {
      ...baseAd,
      file: { fileUrl: 'http://example.com/image.png' },
    };

    render(<BoxAdvertisement advertising={ad} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', ad.url);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', ad.file!.fileUrl);
    expect(img).toHaveAttribute('alt', 'Publicidad');
  });

  test('renderiza un video cuando fileUrl es de tipo video', () => {
    const ad: Advertisement = {
      ...baseAd,
      file: { fileUrl: 'http://example.com/video.mp4' },
    };

    render(<BoxAdvertisement advertising={ad} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', ad.url);

    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', ad.file!.fileUrl);
    expect(video?.autoplay).toBe(true);
    expect(video?.loop).toBe(true);
    expect(video?.muted).toBe(true);
  });

  test('no renderiza contenido multimedia para tipos de archivo desconocidos y emite advertencia', () => {
    const ad: Advertisement = {
      ...baseAd,
      file: { fileUrl: 'http://example.com/file.txt' },
    };

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    render(<BoxAdvertisement advertising={ad} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', ad.url);

    expect(link.querySelector('img')).toBeNull();
    expect(link.querySelector('video')).toBeNull();

    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toContain('Tipo de archivo no soportado:');

    warnSpy.mockRestore();
  });

  test('renderiza el Box de fallback cuando advertising es falsy', () => {
    render(<BoxAdvertisement advertising={null} />);

    expect(screen.queryByRole('link')).toBeNull();

    const fallbackBox = document.querySelector('div');
    expect(fallbackBox).toBeInTheDocument();
  });
});
