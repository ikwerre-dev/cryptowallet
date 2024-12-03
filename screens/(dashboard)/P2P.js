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
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');
import { Easing } from 'react-native-reanimated';

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

export default function P2PTransferScreen({ navigation }) {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [amount, setAmount] = useState('');
    const [recipientCode, setRecipientCode] = useState('');
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const userCode = 'USER123456'; // This would typically come from the user's account

    const handleSend = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            // Reset form or navigate back
            setAmount('');
            setRecipientCode('');
        }, 2000);
    };

    const renderCurrencyModal = () => (
        <Modal
            visible={showCurrencyModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Currency</Text>
                        <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
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
                                        setSelectedCurrency(currency);
                                        setShowCurrencyModal(false);
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
                <Text style={styles.headerTitle}>P2P Transfer</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}>Your P2P Code</Text>
                    <Text style={styles.codeText}>{userCode}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Recipient's P2P Code</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter recipient's code"
                        placeholderTextColor="#666"
                        value={recipientCode}
                        onChangeText={setRecipientCode}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>
                <Text style={styles.label}>Coin</Text>
                <TouchableOpacity
                    style={styles.currencySelector}
                    onPress={() => setShowCurrencyModal(true)}
                >
                    <View style={styles.currencyInfo}>
                        <CurrencyLogo currency={selectedCurrency} />
                        <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
                    </View>
                    <Ionicons name="chevron-down" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.sendButton, { opacity: amount && recipientCode ? 1 : 0.5 }]}
                    disabled={!amount || !recipientCode}
                    onPress={handleSend}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </ScrollView>

            {renderCurrencyModal()}

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
                        <Text style={styles.successTitle}>Transfer Successful</Text>
                        <Text style={styles.successMessage}>
                            Your P2P transfer has been processed successfully
                        </Text>
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
        padding: 16,
    },
    codeCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    codeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7B61FF',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 12,
        paddingVertical:20,
        color: '#fff',
        fontSize: 18,
    },
    currencySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
        marginTop:10
    },
    currencyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginLeft: 8,
    },
    sendButton: {
        backgroundColor: '#7B61FF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    sendButtonText: {
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
    },
});

