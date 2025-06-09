import LoginPage from '@/components/LoginPage';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { MusicProvider } from '@/components/MusicContext';
import MusicPlayer from '@/components/MusicPlayer';

const AppContent = () => {
  const { user } = useAuth();
  if (!user) {
    return <LoginPage />;
  }

  return (
    <MusicProvider>
      <MusicPlayer />
    </MusicProvider>
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
