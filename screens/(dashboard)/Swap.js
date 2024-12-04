import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const currencies = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.5, fallbackIcon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', balance: 2.5, fallbackIcon: 'Ξ' },
  { symbol: 'USDT', name: 'Tether', balance: 1000, fallbackIcon: '₮' },
  { symbol: 'BNB', name: 'Binance-coin', balance: 10, fallbackIcon: 'BNB' },
  { symbol: 'ADA', name: 'Cardano', balance: 500, fallbackIcon: '₳' },
];

const CurrencyLogo = ({ currency, size = 24 }) => {
  const [hasError, setHasError] = useState(false);
  const logoUrl = `https://cryptologos.cc/logos/${currency.name.toLowerCase()}-${currency.symbol.toLowerCase()}-logo.png`;

  if (hasError) {
    return <Text style={[styles.currencyIcon, { fontSize: size }]}>{currency.fallbackIcon}</Text>;
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
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('0');
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 180], Extrapolate.CLAMP);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  useEffect(() => {
    // Simulating exchange rate calculation
    if (amount && fromCurrency && toCurrency) {
      const rate = Math.random() * 10 + 0.1; // Random rate between 0.1 and 10.1
      setEstimatedAmount((parseFloat(amount) * rate).toFixed(6));
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    rotation.value = withSpring(rotation.value ? 0 : 1);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount('');
    setEstimatedAmount('0');
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
            <TouchableOpacity onPress={() => isFrom ? setShowFromModal(false) : setShowToModal(false)}>
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
              .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
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
                      <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                      <Text style={styles.currencyName}>{currency.name}</Text>
                    </View>
                  </View>
                  <Text style={styles.currencyBalance}>{currency.balance}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
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
              <Text style={styles.currencySymbol}>{fromCurrency.symbol}</Text>
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
            Balance: {fromCurrency.balance} {fromCurrency.symbol}
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
              <Text style={styles.currencySymbol}>{toCurrency.symbol}</Text>
            </View>
            <Ionicons name="chevron-down" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.estimatedAmount}>{estimatedAmount}</Text>
          <Text style={styles.balance}>
            Balance: {toCurrency.balance} {toCurrency.symbol}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>1 {fromCurrency.symbol} ≈ {(estimatedAmount / amount).toFixed(6)} {toCurrency.symbol}</Text>
        <TouchableOpacity>
          <Text style={styles.feeText}>Fee: 0.1% • View details</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.swapActionButton, { opacity: amount ? 1 : 0.5 }]}
        disabled={!amount}
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // Implement swap action here
        }}
      >
        <Text style={styles.swapActionButtonText}>Swap</Text>
      </TouchableOpacity>

      {renderCurrencyModal(true)}
      {renderCurrencyModal(false)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  swapContainer: {
    margin: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
  },
  currencyContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  currencyIcon: {
    fontSize: 24,
    marginRight: 8,
    color: '#fff',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  estimatedAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7B61FF',
    marginBottom: 8,
  },
  balance: {
    fontSize: 14,
    color: '#666',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(123, 97, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginVertical: 16,
  },
  infoContainer: {
    margin: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  feeText: {
    fontSize: 14,
    color: '#7B61FF',
  },
  swapActionButton: {
    backgroundColor: '#7B61FF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  swapActionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 16,
  },
  currencyList: {
    maxHeight: '70%',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  currencyName: {
    color: '#666',
    fontSize: 14,
  },
  currencyBalance: {
    color: '#fff',
    fontSize: 16,
  },
});

