import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser, setLoading } = useAuth();

    useEffect(() => {
        const completeAuth = async () => {
            const token = searchParams.get('token');
            
            if (!token) {
                console.error('No token in URL');
                navigate('/login?error=auth_failed');
                return;
            }

            try {
                // Exchange URL token for httpOnly cookie
                const res = await api.post('/user/verify-token', { token });
                
                if (res.data.userId) {
                    setUser(res.data);
                    console.log('✅ OAuth login successful:', res.data.email);
                    navigate('/');
                } else {
                    throw new Error('Invalid response');
                }
            } catch (error) {
                console.error('Auth callback failed:', error);
                navigate('/login?error=auth_failed');
            }
        };

        completeAuth();
    }, [searchParams, navigate, setUser, setLoading]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="text-center">
                <div className="h-12 w-12 mx-auto rounded-full border-4 border-gray-700 border-t-green-500 animate-spin"></div>
                <p className="mt-4 text-gray-400">Completing sign in...</p>
            </div>
        </div>
    );
};

export default AuthCallback;