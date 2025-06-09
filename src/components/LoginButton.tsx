import React from 'react';
import GoogleButton from 'react-google-button';
import { useAuth } from '../context/AuthContext';

const LoginButton: React.FC = () => {
    const { login, isLoggingIn } = useAuth();
    return (
        <GoogleButton onClick={login} disabled={isLoggingIn} label="Sign in with Google" />
    );
};

export default LoginButton;
