import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system"; // Import FileSystem to handle caching

import {
  Bell,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Repeat,
  Clock,
} from "react-native-feather";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";

import * as Haptics from "expo-haptics";
import { Accelerometer } from "expo-sensors";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const CryptoCard = ({ symbol, name, price, change, color, onPress }) => {
  const [cachedUri, setCachedUri] = useState(null);

  const logoUri = `https://cryptologos.cc/logos/${name
    .toLowerCase()
    .replace(/\s+/g, "-")}-${symbol.toLowerCase()}-logo.png`;

  // Function to download and cache the image
  const cacheImage = async () => {
    const fileName = logoUri.split("/").pop();
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        setCachedUri(fileUri); // Use the cached file if it exists
      } else {
        const { uri } = await FileSystem.downloadAsync(logoUri, fileUri);
        setCachedUri(uri); // Use the downloaded file
      }
    } catch (error) {
      console.error("Error caching the image:", error);
    }
  };

  useEffect(() => {
    cacheImage();
  }, [logoUri]);

  return (
    <TouchableOpacity
      style={[styles.cryptoCard, { backgroundColor: color }]}
      onPress={onPress}
    >
      <View style={styles.cryptoHeader}>
        <Image
          source={{ uri: cachedUri || logoUri }} // Use cached URI or fallback to original URI
          style={styles.cryptoIcon}
        />
        <View>
          <Text style={styles.cryptoSymbol}>{symbol}</Text>
          <Text style={styles.cryptoName}>{name}</Text>
        </View>
      </View>
      <View style={styles.cryptoFooter}>
        <Text style={styles.cryptoPrice}>{price.toFixed(6)}</Text>
        <Text
          style={[
            styles.cryptoChange,
            { color: change >= 0 ? "#fff" : "#fff" },
          ]}
        >
          {change >= 0 ? "↑" : "↓"}
          {Math.abs(change).toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MarketItem = ({
  icon,
  name,
  symbol,
  price,
  balance,
  change,
  chartData,
  onPress,
}) => {
  const [currentData, setCurrentData] = React.useState(chartData);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...currentData];
      newData.shift();
      newData.push(Math.random() * 100);
      setCurrentData(newData);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentData]);
  // console.log(
  //   `https://cryptologos.cc/logos/${name.toLowerCase().replace(/\s+/g, "-")}-${symbol.toLowerCase()}-logo.png`,
  // );
  //
  const [cachedUri, setCachedUri] = useState(null);

  const logoUri = `https://cryptologos.cc/logos/${name
    .toLowerCase()
    .replace(/\s+/g, "-")}-${symbol.toLowerCase()}-logo.png`;

  const cacheImage = async () => {
    const fileName = logoUri.split("/").pop();
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        setCachedUri(fileUri);
        console.log("fetching cache");
      } else {
        const { uri } = await FileSystem.downloadAsync(logoUri, fileUri);
        setCachedUri(uri);
        console.log("not fetching cache");
      }
    } catch (error) {
      console.error("Error caching the image:", error);
    }
  };
  return (
    <TouchableOpacity style={styles.marketItem} onPress={onPress}>
      <View style={styles.marketItemLeft}>
        <Image
          source={{ uri: cachedUri || logoUri }} // Use cached URI or fallback to original URI
          style={styles.marketIcon}
        />
        <View>
          <Text style={styles.marketName}>{name}</Text>
          <Text style={styles.marketSymbol}>
            {price === 0 ? "0" : price.toFixed(5)} {symbol}
          </Text>
        </View>
      </View>
      <View style={styles.marketItemRight}>
        <View>
          <Text style={styles.cryptoPrice}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(balance)}
          </Text>
          <Text
            style={[
              styles.marketChange,
              { color: change >= 0 ? "#4A8CFF" : "#F44336" },
            ]}
          >
            {change >= 0 ? "↑" : "↓"}
            {Math.abs(change).toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [showBalance, setShowBalance] = React.useState(true);
  const [shakeCount, setShakeCount] = useState(0);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const { user, userId, transactions } = useAuth();
  const { balances, networkStatus } = useAuth();
  const [balancedata, SetBalanceData] = useState([]);
  // const [balances, setsbalances] = useState([]);
  const user_id = user && user.id;
  const [refreshing, setRefreshing] = useState(false);
  // console.log(transactions);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setInterval(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const totalBalance =
    balances &&
    balances.reduce((sum, crypto) => {
      const balance = parseFloat(crypto.balance) || 0;
      return sum + balance;
    }, 0);

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const handlePortfolioPress = (item) => {
    navigation.navigate("CoinDetailScreen", { item });
  };

  const handleNotificationPress = () => {
    navigation.navigate("Transactions");
  };

  const handleButtonPress = (action) => {
    console.log(`${action} button pressed`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate(action);
  };

  useEffect(() => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const shakeThreshold = 2;
      const currentTime = Date.now();

      if (magnitude > shakeThreshold) {
        if (currentTime - lastShakeTime < 1000) {
          setShakeCount(shakeCount + 1);
        } else {
          setShakeCount(1);
        }
        setLastShakeTime(currentTime);
      }

      if (shakeCount >= 2) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        toggleBalanceVisibility();
        setShakeCount(0);
      }
    });

    Accelerometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, [shakeCount, lastShakeTime]);

  const convertUSDToCrypto = (usdAmount, priceOfCrypto) => {
    const cryptoAmount = usdAmount / priceOfCrypto;
    return cryptoAmount;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/user.png")}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={handleNotificationPress}>
            <Bell stroke="#fff" width={24} height={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.balance}>
          <Text style={styles.balanceLabel}>Portfolio Balance</Text>
          <TouchableOpacity
            onPress={toggleBalanceVisibility}
            style={styles.balanceRow}
          >
            {showBalance ? (
              <Text style={styles.balanceAmount}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalBalance)}
              </Text>
            ) : (
              <Text style={styles.balanceAmount}>•••••••</Text>
            )}
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              {showBalance ? (
                <Eye
                  stroke="#fff"
                  width={24}
                  height={24}
                  style={styles.eyeIcon}
                />
              ) : (
                <EyeOff
                  stroke="#fff"
                  width={24}
                  height={24}
                  style={styles.eyeIcon}
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={styles.balanceChange}>
            <Text style={styles.balanceChangeText}>
              {balances && balances[0] && balances[0].priceUsd
                ? convertUSDToCrypto(
                    balances[0].balance,
                    balances[0].priceUsd,
                  ) === 0
                  ? "0"
                  : convertUSDToCrypto(
                      balances[0].balance,
                      balances[0].priceUsd,
                    ).toFixed(5)
                : 0}{" "}
              {balances && balances[0] && balances[0].symbol}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("Receive")}
          >
            <Text style={styles.buttonText}>
              <ArrowDown color={"white"} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("Send")}
          >
            <Text style={styles.buttonText}>
              <ArrowUp color={"white"} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleButtonPress("Swap")}
          >
            <Text style={styles.buttonText}>
              <Repeat color={"white"} />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notportfolio}>
          <View style={styles.notportfolioHeader}>
            <View style={styles.notificationCard}>
                <Text style={styles.cardTitle}>Connect Your Account</Text>
                <Text style={styles.cardSubText}>Link your account to enable seamless interlinking across platforms.</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://swiss-app.pro/?page=connectaccount')} style={styles.connectButton}>
                  <Text style={styles.connectButtonText}>Connect Account</Text>
                </TouchableOpacity>
            </View>
          </View>
          
        </View>

        <View style={styles.portfolio}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioTitle}>Pinned Portfolio</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("My Assets")}
              style={styles.filtertouchableContainer}
            >
              <Text style={styles.portfolioFilter}>View All</Text>
              <ArrowRight width={15} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {balances && balances.length > 0 ? (
              balances
                .slice(0, 2)
                .map((crypto, index) => (
                  <CryptoCard
                    key={crypto.symbol}
                    symbol={crypto.symbol}
                    name={crypto.full_name}
                    price={
                      crypto.priceUsd
                        ? convertUSDToCrypto(crypto.balance, crypto.priceUsd)
                        : 0
                    }
                    change={crypto.changePercent24Hr}
                    color="#7B61FF"
                    onPress={() =>
                      handlePortfolioPress({ ...crypto, index: index + 1 })
                    }
                  />
                ))
            ) : (
              <Text style={{ color: "#ccc" }}>Fetching...</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.market}>
          <Text style={styles.marketTitle}>My Portfolio</Text>
          {balances && balances.length > 0 ? (
            balances.map((crypto, index) => (
              <MarketItem
                key={crypto.symbol}
                symbol={crypto.symbol}
                name={crypto.full_name}
                price={
                  crypto.priceUsd
                    ? convertUSDToCrypto(crypto.balance, crypto.priceUsd)
                    : 0
                }
                balance={crypto.priceUsd ? crypto.balance : 0}
                change={crypto.changePercent24Hr}
                onPress={() =>
                  handlePortfolioPress({ ...crypto, index: index + 1 })
                }
                chartData={[40, 45, 35, 50, 49, 60, 70, 91, 85, 87, 80, 75, 85]}
              />
            ))
          ) : (
            <Text style={{ color: "#ccc" }}>Fetching...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  notportfolio: {
      flex: 1,
      padding: 5,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    notportfolioHeader: {
      // marginBottom: 16,
    },
    notportfolioTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    notificationCard: {
      backgroundColor: '#121212',
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#fff'
    },
    cardSubText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 16,
    },
    connectButton: {
      backgroundColor: '#7B61FF',
      paddingVertical: 10,
      borderRadius: 4,
      alignItems: 'center',
    },
    connectButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  button: {
    backgroundColor: "#121212",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
    width: "30%", // This makes each button 1/3 of the row width
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingVertical: 0,
    paddingBottom: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  balance: {
    padding: 16,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.7,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  eyeIcon: {
    marginLeft: 10,
    opacity: 0.7,
  },
  balanceChange: {
    backgroundColor: "#1B2B1F",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  balanceChangeText: {
    color: "#4A8CFF",
    fontSize: 14,
  },
  portfolio: {
    padding: 16,
  },
  portfolioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  portfolioTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  filtertouchableContainer: {
    flexDirection: "row", // Ensure the text and icon are aligned in a row
    alignItems: "center", // Vertically center the content (text and icon)
    justifyContent: "center", // Horizontally center the content
  },
  portfolioFilter: {
    color: "#4A8CFF",
    fontSize: 14,
    textAlign: "center", // Ensures the text is centered within its container
  },
  cryptoCard: {
    width: "250",
    padding: 18,
    borderRadius: 16,
    marginRight: 16,
  },
  cryptoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cryptoIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  cryptoSymbol: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cryptoName: {
    color: "#fff",
    opacity: 0.7,
  },
  chartcontainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  chart: {
    marginVertical: 16,
  },
  cryptoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  cryptoPrice: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  cryptoChange: {
    fontSize: 14,
  },
  referral: {
    margin: 16,
    padding: 20,
    backgroundColor: "#121212",
    borderRadius: 16,
    position: "relative",
  },
  referralContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  referralTitle: {
    color: "#ccc",
    fontSize: 23,
    fontWeight: "600",
    marginBottom: 4,
  },
  referralDescription: {
    color: "#ddd",
    opacity: 0.7,
    fontSize: 17,
  },
  referralImage: {
    width: 48,
    height: 48,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    color: "white",
  },
  market: {
    padding: 16,
  },
  marketTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    color: "#fff",
  },
  marketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  marketItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  marketIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  marketName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  marketSymbol: {
    color: "#fff",
    opacity: 0.7,
  },
  marketItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniChart: {
    marginRight: 12,
  },
  marketPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
  },
  marketChange: {
    fontSize: 14,
    textAlign: "right",
  },
});
