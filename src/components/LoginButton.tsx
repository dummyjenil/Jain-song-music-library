import React from 'react';
import GoogleButton from 'react-google-button';
import { useAuth } from '../context/AuthContext';

const LoginButton: React.FC = () => {
    const { login } = useAuth();
    return (
        <GoogleButton onClick={login} label="Sign in with Google" />
    );
};

export default LoginButton;
