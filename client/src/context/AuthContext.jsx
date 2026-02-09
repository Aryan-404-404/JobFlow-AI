import { useState, useEffect, useContext, createContext } from "react";
import api from "../config/axios";

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 300));
                const res = await api.get('/user/info');
                if (res.data.userId) {
                    setUser(res.data);
                }
            } catch (err) {
                console.log("No user found");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await api.post('/user/logout');
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, setLoading }} >
            {children}
        </AuthContext.Provider>
    )

}

const useAuth = () => {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth }