import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";

const { width } = Dimensions.get("window");
import { SafeAreaView } from "react-native-safe-area-context";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const CurrencyLogo = ({ currency, size = 24 }) => {
  const [hasError, setHasError] = useState(false);
  const logoUrl = `https://cryptologos.cc/logos/${currency && currency.full_name.toLowerCase()}-${currency && currency.symbol.toLowerCase()}-logo.png`;

  if (hasError) {
    return (
      <Text style={[styles.currencyIcon, { fontSize: size }]}>
        {currency && currency.fallbackIcon}
      </Text>
    );
  }

  return (
    <Image
      source={{ uri: logoUrl }}
      style={{ width: size, height: size }}
      onError={() => setHasError(true)}
    />
  );
};

export default function SwapScreen({ navigation }) {
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [amount, setAmount] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("0");
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currencies, setcurrencies] = useState([]);
  const rotation = useSharedValue(0);
  const { user, balances, userId } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setcurrencies(balances);
    setFromCurrency(balances[0]);
    setToCurrency(balances[1]);
  }, []);
  
  
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const fromUsdPrice = parseFloat(fromCurrency.priceUsd);
      const toUsdPrice = parseFloat(toCurrency.priceUsd);
      
      if (fromUsdPrice && toUsdPrice) {
        const exchangeRate =  fromUsdPrice / toUsdPrice;
        const estimatedValue = parseFloat(amount);
        setEstimatedAmount(estimatedValue.toFixed(2));
      }
    }
  }, [amount, fromCurrency, toCurrency]);
  
  // console.log(estimatedAmount)

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      rotation.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  
  const triggerswap = async () => {
    const generateCacheString = () => {
      // Generates a unique 16-character string (can include letters and digits)
      return Math.random().toString(36).substring(2, 18);
    };

    const payload = {
      user_id: userId,
      fromCurrency: fromCurrency.symbol,
      toCurrency: toCurrency.symbol,
      amount
      
    };

    console.debug(payload);
    if (payload) {
      try {
        const cacheString = generateCacheString();
        const response = await axios.post(
          `https://swiss-app.pro/api/swap?cache=${cacheString}`,
          payload,
        );
        if (response.data.code === 200) {
          console.log(response.data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Swap Successful",
              body: "Swap has been processed successfully!!!",
            },
            trigger: null,
          });
          setShowSuccess(true);
          // setTimeout(() => {
          //   setShowSuccess(false);
          //   // navigation.goBack();
          //   navigation.navigate("Dashboard");
          // }, 2000);
        } else {
          alert(response.data.message);
        }
        console.log(response.data);
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    }
  }
  
  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    rotation.value = withSpring(rotation.value ? 0 : 1);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount("");
    setEstimatedAmount("0");
  };

  const renderCurrencyModal = (isFrom) => (
    <Modal
      visible={isFrom ? showFromModal : showToModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity
              onPress={() =>
                isFrom ? setShowFromModal(false) : setShowToModal(false)
              }
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search currency"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ScrollView style={styles.currencyList}>
            {currencies
              .filter(
                (c) =>
                  c.full_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  c.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((currency) => (
                <TouchableOpacity
                  key={currency.symbol}
                  style={styles.currencyItem}
                  onPress={() => {
                    if (isFrom) {
                      setFromCurrency(currency);
                      setShowFromModal(false);
                    } else {
                      setToCurrency(currency);
                      setShowToModal(false);
                    }
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View style={styles.currencyInfo}>
                    <CurrencyLogo currency={currency} />
                    <View>
                      <Text style={styles.currencySymbol}>
                        {currency.symbol}
                      </Text>
                      <Text style={styles.currencyName}>
                        {currency.full_name}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.currencyBalance}>
                    ${currency.balance}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Swap</Text>
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.swapContainer}>
            <View style={styles.currencyContainer}>
              <Text style={styles.label}>From</Text>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setShowFromModal(true)}
              >
                <View style={styles.currencyInfo}>
                  <CurrencyLogo currency={fromCurrency} />
                  <Text style={styles.currencySymbol}>
                    {fromCurrency && fromCurrency.symbol}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <Text style={styles.balance}>
                Balance: ${fromCurrency && parseFloat(fromCurrency.balance).toFixed(2)}{" "}
              </Text>
              <Text style={styles.balance}>
                1 {fromCurrency && fromCurrency.symbol} to USD: ${fromCurrency && parseFloat(fromCurrency.priceUsd).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
              <Animated.View style={animatedStyle}>
                <Ionicons name="swap-vertical" size={24} color="#7B61FF" />
              </Animated.View>
            </TouchableOpacity>

            <View style={styles.currencyContainer}>
              <Text style={styles.label}>To</Text>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setShowToModal(true)}
              >
                <View style={styles.currencyInfo}>
                  <CurrencyLogo currency={toCurrency} />
                  <Text style={styles.currencySymbol}>
                    {toCurrency && toCurrency.symbol}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.estimatedAmount}>{estimatedAmount}</Text>
              <Text style={styles.balance}>
                Balance: ${toCurrency && parseFloat(toCurrency.balance).toFixed(2)}{" "}
              </Text>
              <Text style={styles.balance}>
                1 {toCurrency && toCurrency.symbol} to USD: ${toCurrency && parseFloat(toCurrency.priceUsd).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              1 {fromCurrency && fromCurrency.symbol} to{" "}
              {(estimatedAmount / amount).toFixed(2)}{" "}
              {toCurrency && toCurrency.symbol}
            </Text>
            <TouchableOpacity>
              <Text style={styles.feeText}>Fee: 0.1% </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.swapActionButton, { opacity: amount ? 1 : 0.5 }]}
            disabled={!amount}
            onPress={triggerswap}
          >
            <Text style={styles.swapActionButtonText}>Swap</Text>
          </TouchableOpacity>

          {renderCurrencyModal(true)}
          {renderCurrencyModal(false)}
          <Modal
            visible={showSuccess}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.successModal}>
              <MotiView
                from={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "timing",
                  duration: 500,
                  easing: Easing.out(Easing.ease),
                }}
                style={styles.successContent}
              >
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark" size={48} color="#7B61FF" />
                </View>
                <Text style={styles.successTitle}>Transaction Confirmed</Text>
                <Text style={styles.successMessage}>
                  Your Swap has been successfully processed
                </Text>
                <TouchableOpacity
                  style={styles.successButton}
                  onPress={() => {
                    setShowSuccess(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.successButtonText}>Done</Text>
                </TouchableOpacity>
              </MotiView>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    // paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  swapContainer: {
    margin: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
  },
  currencyContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  currencyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  currencyIcon: {
    fontSize: 24,
    marginRight: 8,
    color: "#fff",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  estimatedAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7B61FF",
    marginBottom: 8,
  },
  balance: {
    fontSize: 14,
    color: "#666",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "rgba(123, 97, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
    marginVertical: 16,
  },
  infoContainer: {
    margin: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  feeText: {
    fontSize: 14,
    color: "#7B61FF",
  },
  swapActionButton: {
    backgroundColor: "#7B61FF",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  swapActionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  searchInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 16,
  },
  currencyList: {
    maxHeight: "70%",
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  currencyName: {
    color: "#666",
    fontSize: 14,
  },
  currencyBalance: {
    color: "#fff",
    fontSize: 16,
  },
  successModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  successContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "80%",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(123, 97, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successMessage: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: "#7B61FF",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  successButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
