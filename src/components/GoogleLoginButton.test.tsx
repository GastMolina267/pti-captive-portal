import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleLoginButton from './GoogleLoginButton';
import { GoogleLogin } from '@react-oauth/google';

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: jest.fn((props) => (
    <button onClick={() => props.onSuccess({ credential: 'dummy-credential' })}>
      GoogleLoginMock
    </button>
  )),
}));

describe('GoogleLoginButton', () => {
  const onSuccessMock = jest.fn();
  const onErrorMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CircularProgress when isLoading is true', () => {
    render(<GoogleLoginButton onSuccess={onSuccessMock} onError={onErrorMock} isLoading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders GoogleLogin when isLoading is false and calls onSuccess on click', () => {
    render(<GoogleLoginButton onSuccess={onSuccessMock} onError={onErrorMock} isLoading={false} />);
    const loginButton = screen.getByText('GoogleLoginMock');
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);
    expect(onSuccessMock).toHaveBeenCalledWith({ credential: 'dummy-credential' });
  });

  test('GoogleLogin receives an onError prop', () => {
    render(<GoogleLoginButton onSuccess={onSuccessMock} onError={onErrorMock} isLoading={false} />);
    expect(GoogleLogin).toHaveBeenCalled();
    const props = (GoogleLogin as jest.Mock).mock.calls[0][0];
    expect(typeof props.onError).toBe('function');
  });
});
