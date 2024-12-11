import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Snackbar from "./Snackbar"; // Import the Snackbar component
import { View } from "react-native";
import * as Network from "expo-network";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [userId, setUserId] = useState(null);
  const [balances, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkStatus, setnetworkStatus] = useState(true);
  const [biometricEmail, setBiometricEmail] = useState(null);

  const generateCacheString = () => {
    return Math.random().toString(36).substring(2, 18);
  };

  const loadUserData = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedUserDetails = await AsyncStorage.getItem("userDetails");

      if (storedUser) {
        setUser(JSON.parse(storedUser));

        if (storedUserDetails) {
          const userDetails = JSON.parse(storedUserDetails);
          setUser(userDetails.data);
          setBalance(userDetails.user);
        }

        const cacheString = generateCacheString();
        const response = await axios.post(
          `https://swiss-app.pro/api/getUserDetails?cache=${cacheString}`,
          JSON.parse(storedUser),
        );

        if (response.data.code === 200) {
          setUser(response.data.data);
          setBalance(response.data.user);
          await AsyncStorage.setItem(
            "userDetails",
            JSON.stringify(response.data),
          );
        } else {
          alert(response.data.message);
          logout();
        }
      }
      setnetworkStatus(true);
    } catch (error) {
      setnetworkStatus(false);
      // console.warn(error.response ? error.response.data : error.message);
      const storedUserDetails = await AsyncStorage.getItem("userDetails");
      if (storedUserDetails) {
        // console.log('API unreachable. Fetching from cache.');
        const userDetails = JSON.parse(storedUserDetails);
        setUser(userDetails.data);
        setBalance(userDetails.user);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserTransactions = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedUserDetails =
        await AsyncStorage.getItem("getAllTransactions");

      if (storedUser) {
        setUser(JSON.parse(storedUser));

        if (storedUserDetails) {
          const userDetails = JSON.parse(storedUserDetails);
          setTransactions(userDetails.data);
        }

        const cacheString = generateCacheString();
        const response = await axios.post(
          `https://swiss-app.pro/api/getAllTransactions?cache=${cacheString}`,
          JSON.parse(storedUser),
        );

        if (response.data.code === 200) {
          setTransactions(response.data.data);
          await AsyncStorage.setItem(
            "getAllTransactions",
            JSON.stringify(response.data),
          );
        } else {
          console.warn(response.data.message);
        }
      }
      setnetworkStatus(true);
    } catch (error) {
      setnetworkStatus(false);
      // console.warn(error.response ? error.response.data : error.message);
      const storedUserDetails =
        await AsyncStorage.getItem("getAllTransactions");
      if (storedUserDetails) {
        // console.log('API unreachable. Fetching from cache.');
        const userDetails = JSON.parse(storedUserDetails);
        setTransactions(userDetails.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserTransactions();
    const intervalId = setInterval(() => {
      loadUserTransactions();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [loadUserTransactions]);

  // Function to check the internet connectivity status
  const checkNetworkStatus = async () => {
    const networkState = await Network.getNetworkStateAsync();
    if (networkStatus) {
      setnetworkStatus(
        networkState.isConnected && networkState.isInternetReachable,
      );
    }
  };

  // Listen for changes in the network status
  useEffect(() => {
    // Check the initial status
    checkNetworkStatus();

    // Set up a polling mechanism to periodically check the network status
    const intervalId = setInterval(() => {
      checkNetworkStatus();
    }, 2000); // Check every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchUserId = useCallback(async () => {
    const storedUser = await AsyncStorage.getItem("user");
    setUserId(storedUser && JSON.parse(storedUser).user_id);
  }, []);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    loadUserData();
    const intervalId = setInterval(() => {
      loadUserData();
    }, 2000);
    return () => clearInterval(intervalId);
  }, [loadUserData]);

  const login = useCallback(async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userDetails");
    await setUser(null);
    await setBalance(null);
  }, []);

  const saveBiometricEmail = useCallback(async (email) => {
    setBiometricEmail(email);
    await AsyncStorage.setItem("biometric_email", email);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        userId,
        transactions,
        balances,
        networkStatus,
        logout,
        loading,
        biometricEmail,
        saveBiometricEmail,
      }}
    >
      <View style={{ flex: 1 }}>
        {children}
        <Snackbar
          message="Network error, Please check your internet."
          visible={!networkStatus}
        />
      </View>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
