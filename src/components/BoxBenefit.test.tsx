import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoxBenefit from './BoxBenefit';
import { Benefit } from '../interfaces/benefitInterfaces';

describe('BoxBenefit', () => {
  const mockBenefit: Benefit = {
    id: '1',
    name: 'Benefit 1',
    description: 'Esta es la descripción del beneficio',
    file: {
      fileUrl: 'http://example.com/image.png',
    },
    url: 'http://example.com/benefit',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  };

  test('renderiza correctamente el beneficio cuando se proporciona un objeto válido', () => {
    render(<BoxBenefit benefit={mockBenefit} />);

    expect(screen.getByText(mockBenefit.name)).toBeInTheDocument();
    expect(screen.getByText(mockBenefit.description)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /ver más/i });
    expect(link).toHaveAttribute('href', mockBenefit.url);

    const backgroundBox = screen.getByTestId('background-image');
    expect(backgroundBox).toHaveStyle(`background-image: url(${mockBenefit.file?.fileUrl})`);
  });

  test('renderiza el contenido de fallback cuando benefit es falsy', () => {
    render(<BoxBenefit benefit={null} />);
    expect(screen.getByText(/cargando beneficio/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /ver más/i })).toBeNull();
  });
});
