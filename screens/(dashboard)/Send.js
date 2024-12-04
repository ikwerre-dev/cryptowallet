import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
// import { RNCamera } from 'react-native-camera';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
 
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


const { width } = Dimensions.get('window');

export default function SendScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cameraRef = useRef(null);

  const cryptoData = [
    { symbol: "BTC", name: "Bitcoin", price: 6780, balance: 0.0000013, value: "$23.56", icon: "🟡" },
    { symbol: "ETH", name: "Ethereum", price: 1478.1, balance: 0.17, value: "$234", icon: "🟣" },
    { symbol: "BNB", name: "Binance", price: 123.77, balance: 0.01745, value: "$4.98", icon: "🟡" },
    { symbol: "MATIC", name: "Polygon", price: 16.96, balance: 34.3, value: "$30", icon: "🟣" },
    { symbol: "XRP", name: "Ripple", price: 0.98, balance: 3.00912, value: "$30", icon: "⚪" },
  ];

  const contacts = [
    { id: 1, name: "Bessie Cooper", address: "0xdhfhdf...kjseu" },
    { id: 2, name: "Jerome Bell", address: "0xdhfhdf...kjseu" },
    { id: 3, name: "Marvin McKinney", address: "0xdhfhdf...kjseu" },
    { id: 4, name: "Kathryn Murphy", address: "0xdhfhdf...kjseu" },
    { id: 5, name: "Ralph Edwards", address: "0xdhfhdf...kjseu" },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTokens = cryptoData.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNumberPress = (num) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (amount.includes('.') && num === '.') return;
    if (amount.includes('.')) {
      const decimals = amount.split('.')[1];
      if (decimals && decimals.length >= 8) return;
    }
    setAmount(prev => prev + num);
  };

  const handleDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAmount(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Transaction Successful',
        body: "Transaction has been processed successfully!!!",
      },
      trigger: null,
    });
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // navigation.goBack();
      navigation.navigate('Dashboard');
    }, 2000);
  };

  const handleBarCodeScanned = ({ data }) => {
    setRecipient(data);
    setShowScanner(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderStep1 = () => (
    <View style={styles.container}>
      <Text style={styles.label}>Send To</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter recipient address"
          placeholderTextColor="#666"
          value={recipient}
          onChangeText={setRecipient}
        />
        <TouchableOpacity onPress={() => setShowScanner(true)} style={styles.scanButton}>
          <Ionicons name="scan" size={24} color="#7B61FF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#7B61FF" />
        <Text style={styles.addButtonText}>Add this to your address book</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: 24 }]}>Recent Transfers</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipient"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.contactList}>
        {filteredContacts.map(contact => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => {
              setRecipient(contact.address);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.contactAvatar}>
              <Text style={styles.avatarText}>{contact.name[0]}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactAddress}>{contact.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { opacity: recipient ? 1 : 0.5 }]}
        disabled={!recipient}
        onPress={() => {
          setStep(2);
          setShowTokenModal(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Amount</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{amount || '0'}</Text>
        <TouchableOpacity style={styles.maxButton}>
          <Text style={styles.maxButtonText}>Max</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenIcon}>{selectedToken?.icon}</Text>
          <View>
            <Text style={styles.tokenSymbol}>{selectedToken?.symbol}</Text>
            <Text style={styles.tokenName}>{selectedToken?.name}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.tokenBalance}>{selectedToken?.balance}</Text>
          <Text style={styles.tokenValue}>{selectedToken?.value}</Text>
        </View>
      </View>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.keypadButton}
            onPress={() => handleNumberPress(num.toString())}
          >
            <Text style={styles.keypadButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.keypadButton}
          onPress={handleDeletePress}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { opacity: amount ? 1 : 0.5 }]}
        disabled={!amount}
        onPress={handleConfirm}
      >
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send</Text>
        <View style={{ width: 24 }} />
      </View>

      {step === 1 ? renderStep1() : renderStep2()}

      {/* QR Scanner Modal */}
      <Modal visible={showScanner} animationType="slide">
        <View style={styles.scannerContainer}>
          {/* <RNCamera
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            type={RNCamera.Constants.Type.back}
            onBarCodeRead={handleBarCodeScanned}
            captureAudio={false}
          /> */}
          <TouchableOpacity
            style={styles.closeScannerButton}
            onPress={() => setShowScanner(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Token Selection Modal */}
      <Modal
        visible={showTokenModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Token</Text>
              <TouchableOpacity onPress={() => setShowTokenModal(false)}>
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
              {filteredTokens.map((token) => (
                <TouchableOpacity
                  key={token.symbol}
                  style={styles.tokenItem}
                  onPress={() => {
                    setSelectedToken(token);
                    setShowTokenModal(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenIcon}>{token.icon}</Text>
                    <View>
                      <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                      <Text style={styles.tokenName}>{token.name}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.tokenBalance}>{token.balance}</Text>
                    <Text style={styles.tokenValue}>{token.value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
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
              type: 'timing',
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
              Your transaction has been successfully processed
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
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 0,
    marginTop:10,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 16,
    borderRadius: 8,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 16,
    fontSize: 16,
  },
  scanButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#7B61FF',
    marginLeft: 8,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 16,
    borderRadius: 8,
    padding: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  contactList: {
    flex: 1,
    marginHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    marginLeft: 12,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  contactAddress: {
    color: '#666',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#7B61FF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  amount: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  maxButton: {
    backgroundColor: '#7B61FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  maxButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcon: {
    fontSize: 24,
    marginRight: 12,
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
  tokenBalance: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  tokenValue: {
    color: '#666',
    fontSize: 14,
    textAlign: 'right',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  keypadButton: {
    width: width / 3 - 24,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  keypadButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeScannerButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
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
  successModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(123, 97, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successMessage: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: '#7B61FF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

