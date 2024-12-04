import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [biometricEmail, setBiometricEmail] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            const storedBiometricEmail = await AsyncStorage.getItem('biometric_email');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            if (storedBiometricEmail) {
                setBiometricEmail(storedBiometricEmail);
            }
            setLoading(false);
        };

        loadUserData();
    }, []);

    const login = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    const saveBiometricEmail = async (email) => {
        setBiometricEmail(email);
        await AsyncStorage.setItem('biometric_email', email);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, biometricEmail, saveBiometricEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

