import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

export default function ReceiveScreen() {
  const [selectedToken, setSelectedToken] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [walletAddresses] = useState({
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    ADA: "addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    UNI: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    USDT: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  });
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);

  const cryptoData = [
    { symbol: "BTC", name: "Bitcoin", price: 6780, change: 11.75 },
    { symbol: "ETH", name: "Ethereum", price: 1478.1, change: 4.7 },
    { symbol: "ADA", name: "Cardano", price: 123.77, change: 11.75 },
    { symbol: "UNI", name: "Uniswap", price: 16.96, change: -11.75 },
    { symbol: "USDT", name: "Tether", price: 0.98, change: 0.15 },
  ];

  const filteredCryptoData = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = async () => {
    if (selectedToken && walletAddresses[selectedToken.symbol]) {
      await Clipboard.setStringAsync(walletAddresses[selectedToken.symbol]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setShowCopiedPopup(true);
      setTimeout(() => setShowCopiedPopup(false), 2000);
    }
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Token Selection Button */}
        <TouchableOpacity
          style={styles.tokenSelector}
          onPress={() => setModalVisible(true)}
        >
          {selectedToken ? (
            <Text style={styles.selectedTokenText}>
              {selectedToken.symbol} - {selectedToken.name}
            </Text>
          ) : (
            <Text style={styles.placeholderText}>Select Token</Text>
          )}
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Info Message */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#7B61FF" />
          <Text style={styles.infoText}>
            Only send {selectedToken?.symbol || 'tokens'} to this address
          </Text>
        </View>

        {/* QR Code */}
        {selectedToken && (
          <View style={styles.qrContainer}>
            <QRCode
              value={walletAddresses[selectedToken.symbol]}
              size={200}
              color="white"
              backgroundColor="transparent"
            />
          </View>
        )}

        {/* Wallet Address */}
        {selectedToken && (
          <TouchableOpacity style={styles.addressContainer} onPress={copyToClipboard}>
            <Text style={styles.addressText}>
              {walletAddresses[selectedToken.symbol].slice(0, 6)}...
              {walletAddresses[selectedToken.symbol].slice(-6)}
            </Text>
            <Ionicons name="copy-outline" size={20} color="#7B61FF" />
          </TouchableOpacity>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              if (selectedToken && walletAddresses[selectedToken.symbol]) {
                Sharing.shareAsync(`Send me ${selectedToken.symbol} to my wallet: ${walletAddresses[selectedToken.symbol]}`);
              }
            }}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
        {showCopiedPopup && (
          <View style={styles.copiedPopup}>
            <Ionicons name="checkmark-circle" size={24} color="#7B61FF" />
            <Text style={styles.copiedPopupText}>Copied!</Text>
          </View>
        )}
      </View>

      {/* Token Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Token</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search token"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView style={styles.tokenList}>
              {filteredCryptoData.map((crypto) => (
                <TouchableOpacity
                  key={crypto.symbol}
                  style={styles.tokenItem}
                  onPress={() => {
                    setSelectedToken(crypto);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.tokenInfo}>
                    <View style={[styles.tokenIcon, { backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16) }]}>
                      <Text style={styles.tokenIconText}>{crypto.symbol[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.tokenSymbol}>{crypto.symbol}</Text>
                      <Text style={styles.tokenName}>{crypto.name}</Text>
                    </View>
                  </View>
                  <Text style={styles.tokenPrice}>${crypto.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 10,

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
  content: {
    flex: 1,
    padding: 16,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedTokenText: {
    color: '#fff',
    fontSize: 16,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 190, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    color: '#7B61FF',
    marginLeft: 8,
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  addressText: {
    color: '#fff',
    marginRight: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  shareButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7B61FF',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#7B61FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
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
    padding: 16,
    borderRadius: 8,
    color: '#fff',
    marginBottom: 16,
  },
  tokenList: {
    maxHeight: '70%',
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tokenIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenSymbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenName: {
    color: '#666',
    fontSize: 14,
  },
  tokenPrice: {
    color: '#fff',
    fontSize: 16,
  },
  copiedPopup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 50,
  },
  copiedPopupText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});

