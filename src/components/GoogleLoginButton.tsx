import React from 'react';
import { CircularProgress } from '@mui/material';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onSuccess: (response: CredentialResponse) => void;
  onError: (error: Error) => void;
  isLoading?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  isLoading = false,
}) => {
  return (
    <>
      {isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <div
          style={{
            width: '250px',
            margin: '0 auto',
            marginBottom: '2rem',
            transform: 'scale(1.2)',
          }}>
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => onError(new Error('Error en el login con Google'))}
            theme="filled_blue"
            shape="pill"
            type="standard"
            text="signup_with"
            useOneTap
          />
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
