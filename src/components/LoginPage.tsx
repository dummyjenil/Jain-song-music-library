import React from 'react';
import LoginButton from './LoginButton';

const LoginPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to JainMelo 🎶</h1>
        <p style={styles.subtitle}>Sign in with your Google account to get started</p>
        <div style={styles.buttonWrapper}>
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
    transition: 'background 0.5s ease-in-out',
  },
  card: {
    padding: '3rem 2.5rem',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    animation: 'fadeIn 0.5s ease-out',
  },
  title: {
    fontSize: '2rem',
    color: '#1a202c',
    marginBottom: '0.5rem',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#4a5568',
    marginBottom: '2rem',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
};

export default LoginPage;
