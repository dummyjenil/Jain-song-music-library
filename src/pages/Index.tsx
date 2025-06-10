import { MusicProvider } from '@/components/MusicContext';
import MusicPlayer from '@/components/MusicPlayer';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginPage from './LoginPage';

const AppContent = () => {
  const { user } = useAuth();
  return user ? (
    <MusicProvider>
      <MusicPlayer />
    </MusicProvider>
  ) : (
    <LoginPage />
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
