import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [biometricEmail, setBiometricEmail] = useState(null);

    // Function to generate a unique cache string
    const generateCacheString = () => {
        return Math.random().toString(36).substring(2, 18);
    };

    // Load user data from AsyncStorage and update the user state
    const loadUserData = useCallback(async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));

            try {
                const cacheString = generateCacheString();
                const response = await axios.post(`http://192.168.1.115/cryptowallet_api/getUserDetails?cache=${cacheString}`, JSON.parse(storedUser));
                if (response.data.code === 200) {
                    setUser(response.data.data); // Update user state
                } else {
                    alert(response.data.message);
                    logout(); // Call logout if the response is not successful
                }
            } catch (error) {
                console.error(error.response ? error.response.data : error.message);
            }
        }

        setLoading(false);
    }, []);

    // Start fetching the user data periodically
    useEffect(() => {
        loadUserData(); // Load user data initially

        // Polling the data every 2 seconds
        const intervalId = setInterval(() => {
            loadUserData();
        }, 2000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [loadUserData]);

    // Login function to set user and store in AsyncStorage
    const login = useCallback(async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    }, []);

    // Logout function to clear user data and AsyncStorage
    const logout = useCallback(async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    }, []);

    // Save biometric email to AsyncStorage
    const saveBiometricEmail = useCallback(async (email) => {
        setBiometricEmail(email);
        await AsyncStorage.setItem('biometric_email', email);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, biometricEmail, saveBiometricEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
