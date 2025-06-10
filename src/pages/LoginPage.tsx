import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();

    return (
        <div style={{ textAlign: 'center', marginTop: '30%' }}>
            <button onClick={login}>Login with Google</button>
        </div>
    );
};

export default LoginPage;
