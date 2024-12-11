import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Bell, X, Eye, EyeOff, ArrowRight, ArrowDown, ArrowUp, Repeat } from 'react-native-feather';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { StatusBar } from 'react-native';
import { Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';


const CryptoCard = ({ symbol, name, price, change, color, onPress }) => (
    <TouchableOpacity style={[styles.cryptoCard, { backgroundColor: color }]} onPress={onPress}>
        <View style={styles.cryptoHeader}>
            <Image
                 source={{ uri: `https://cryptologos.cc/logos/${name.toLowerCase().replace(/\s+/g, '-')}-${symbol.toLowerCase()}-logo.png` }}
                style={styles.cryptoIcon}
            />
            <View>
                <Text style={styles.cryptoSymbol}>{symbol}</Text>
                <Text style={styles.cryptoName}>{name}</Text>
            </View>
        </View>
        <View style={styles.cryptoFooter}>
            <Text style={styles.cryptoPrice}>{(price.toFixed(6))}</Text>
            <Text style={[styles.cryptoChange, { color: change >= 0 ? '#fff' : '#fff' }]}>
                {change >= 0 ? '↑' : '↓'}{Math.abs(change).toFixed(2)}%
            </Text>
        </View>
    </TouchableOpacity>
);


const MarketItem = ({ icon, name, symbol, price, balance, change, chartData, onPress }) => {
    const [currentData, setCurrentData] = React.useState(chartData);

    React.useEffect(() => {
        const interval = setInterval(() => {
            // Simulate real-time data updates
            const newData = [...currentData];
            newData.shift();
            newData.push(Math.random() * 100);
            setCurrentData(newData);
        }, 3000);

        return () => clearInterval(interval);
    }, [currentData]);

    return (
        <TouchableOpacity style={styles.marketItem} onPress={onPress}>

            <View style={styles.marketItemLeft}>
                <Image source={{ uri: `https://cryptologos.cc/logos/${name.toLowerCase().replace(/\s+/g, '-')}-${symbol.toLowerCase()}-logo.png` }} style={styles.marketIcon} />

                <View>
                    <Text style={styles.marketName}>{name}</Text>
                    <Text style={styles.marketSymbol}>{price === 0 ? '0' : price.toFixed(5)} {symbol}</Text>
                </View>
            </View>
            <View style={styles.marketItemRight}>

                <View>
                    <Text style={styles.cryptoPrice}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance)}
                    </Text>
                    <Text style={[styles.marketChange, { color: change >= 0 ? '#4A8CFF' : '#F44336' }]}>
                        {change >= 0 ? '↑' : '↓'}{Math.abs(change).toFixed(2)}%
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function PortfolioScreen() {
    const navigation = useNavigation();
    const [showBalance, setShowBalance] = React.useState(true);
    const [shakeCount, setShakeCount] = useState(0);
    const [lastShakeTime, setLastShakeTime] = useState(0);
    const { user } = useAuth();

    const uid = user.uid;


    const [prices, setPrices] = useState({});

    const [balances, setBalances] = useState([
        { symbol: 'BTC', balance: user && user.btc_balance, full_name: 'Bitcoin' },
        { symbol: 'USDT', balance: user && user.usdt_balance, full_name: 'Tether' },
        { symbol: 'ADA', balance: user && user.ada_balance, full_name: 'Cardano' },
        { symbol: 'BNB', balance: user && user.bnb_balance, full_name: 'Binance Coin' },
        { symbol: 'DOGE', balance: user && user.doge_balance, full_name: 'Dogecoin' },
        { symbol: 'ETH', balance: user && user.eth_balance, full_name: 'Ethereum' },
        { symbol: 'MATIC', balance: user && user.matic_balance, full_name: 'Polygon' },
        { symbol: 'SOL', balance: user && user.sol_balance, full_name: 'Solana' },
        { symbol: 'USDC', balance: user && user.usdc_balance, full_name: 'USD Coin' },
        { symbol: 'XRP', balance: user && user.xrp_balance, full_name: 'Ripple' },
    ]);
    const fetchCryptoPrices = async () => {
        try {
            const response = await axios.get('https://api.coincap.io/v2/assets');
            const assets = response.data.data;

            const updatedBalances = balances.map((crypto) => {
                const asset = assets.find((asset) => asset.symbol === crypto.symbol);
                return {
                    ...crypto,
                    priceUsd: asset ? parseFloat(asset.priceUsd) : 0, // Add price if available
                    changePercent24Hr: asset ? parseFloat(asset.changePercent24Hr) : 0, // Add change percentage if available
                    rank: asset ? asset.rank : 0, // Add price if available
                    maxsupply: asset ? asset.maxSupply : 0, // Add price if available
                    marketcap: asset ? asset.marketCapUsd : 0, // Add price if available
                    id: asset ? asset.id : 0, // Add price if available
                    supply: asset ? asset.supply : 0, // Add price if available
                    maxSupply: asset ? asset.maxSupply : 0, // Add price if available

                };
            });

            setBalances(updatedBalances);
            // console.log(assets)
        } catch (error) {
            console.error('Error fetching crypto prices:', error.message);
        }
    };

    useEffect(() => {
        fetchCryptoPrices(); // Initial fetch
        const intervalId = setInterval(fetchCryptoPrices, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);



    const totalBalance = balances.reduce((sum, crypto) => {
        const balance = parseFloat(crypto.balance) || 0; // Convert balance to a number, default to 0 if invalid
        return sum + balance;
    }, 0);


    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    };
    const handlePortfolioPress = (item) => {
        navigation.navigate('CoinDetailScreen', { item });
    };

    const handleNotificationPress = (item) => {
        navigation.navigate('Notification');
    };
    const handleButtonPress = (action) => {
        console.log(`${action} button pressed`);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate(action);

    };

    useEffect(() => {
        const subscription = Accelerometer.addListener((accelerometerData) => {
            const { x, y, z } = accelerometerData;

            // Calculate shake magnitude
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            const shakeThreshold = 2; // Adjust this value if necessary
            const currentTime = Date.now();

            // Detect shake and check the time difference for double shake
            if (magnitude > shakeThreshold) {
                if (currentTime - lastShakeTime < 1000) { // 1 second window for double shake
                    setShakeCount(shakeCount + 1);
                } else {
                    setShakeCount(1); // reset count if shake is too far apart
                }

                setLastShakeTime(currentTime);
            }

            // If double shake is detected, toggle the balance visibility
            if (shakeCount >= 2) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

                toggleBalanceVisibility();
                setShakeCount(0); // Reset shake count after action
            }
        });

        // Set update interval for accelerometer (100ms)
        Accelerometer.setUpdateInterval(100);

        // Cleanup the subscription when the component unmounts
        return () => subscription.remove();
    }, [shakeCount, lastShakeTime]); // Dependencies on shakeCount and lastShakeTime



    //   useEffect(() => {
    //     const interval = setInterval(() => {
    //       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    //     }, 2000);

    //     return () => clearInterval(interval);
    //   }, []);
    const convertUSDToCrypto = (usdAmount, priceOfCrypto) => {
        const cryptoAmount = usdAmount / priceOfCrypto;  // Convert USD to Crypto
        return cryptoAmount;
    };


    return (
        <>

            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                     
                    <View style={styles.balance}>
                        <Text style={styles.balanceLabel}>Select Coin to continue</Text>
                        
                    </View>
                 
                    <View style={styles.market}>
                        {/* <Text style={styles.marketTitle}>My Portfolio</Text> */}
                        {balances.map((crypto, index) => (
                            <MarketItem
                                key={crypto.symbol}
                                symbol={crypto.symbol}
                                name={crypto.full_name}
                                price={crypto.priceUsd ? convertUSDToCrypto(crypto.balance, crypto.priceUsd) : 0}  // Amount in USD of your crypto balance
                                balance={crypto.priceUsd ? (crypto.balance) : 0}   // Value of your crypto in USD
                                change={crypto.changePercent24Hr}
                                onPress={() => handlePortfolioPress({ ...crypto, index: index + 1 })}
                                chartData={[40, 45, 35, 50, 49, 60, 70, 91, 85, 87, 80, 75, 85]}
                            />
                        ))}

                    </View>
                </ScrollView>
            </View>
        </>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',

    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 5

    },
    button: {
        backgroundColor: '#121212',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 10,
        width: '30%',  // This makes each button 1/3 of the row width
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        backgroundColor: '#7B61FF',
        paddingTop: 80
    },
    balanceLabel: {
        color: '#fff',
        fontSize: 16,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    eyeIcon: {
        marginLeft: 10,
        opacity: 0.7,
    },
    balanceChange: {
        backgroundColor: '#1B2B1F',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    balanceChangeText: {
        color: '#fff',
        fontSize: 14,
    },
    portfolio: {
        padding: 16,
    },
    portfolioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    portfolioTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    filtertouchableContainer: {
        flexDirection: 'row', // Ensure the text and icon are aligned in a row
        alignItems: 'center', // Vertically center the content (text and icon)
        justifyContent: 'center', // Horizontally center the content
    },
    portfolioFilter: {
        color: '#4A8CFF',
        fontSize: 14,
        textAlign: 'center', // Ensures the text is centered within its container
    },
    cryptoCard: {
        width: '250',
        padding: 18,
        borderRadius: 16,
        marginRight: 16,
    },
    cryptoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cryptoIcon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    cryptoSymbol: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cryptoName: {
        color: '#fff',
        opacity: 0.7,
    },
    chartcontainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    chart: {
        marginVertical: 16,
    },
    cryptoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40
    },
    cryptoPrice: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    cryptoChange: {
        fontSize: 14,
    },
    referral: {
        margin: 16,
        padding: 20,
        backgroundColor: '#121212',
        borderRadius: 16,
        position: 'relative',
    },
    referralContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    referralTitle: {
        color: '#ccc',
        fontSize: 23,
        fontWeight: '600',
        marginBottom: 4,
    },
    referralDescription: {
        color: '#ddd',
        opacity: 0.7,
        fontSize: 17
    },
    referralImage: {
        width: 48,
        height: 48,
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        color: 'white'
    },
    market: {
        padding: 16,
        paddingTop:25
    },
    marketTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    filterScroll: {
        marginBottom: 16,
    },
    filterChip: {
        backgroundColor: '#222',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    filterText: {
        color: '#fff',
    },
    marketItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    marketItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    marketIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    marketName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    marketSymbol: {
        color: '#fff',
        opacity: 0.7,
    },
    marketItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniChart: {
        marginRight: 12,
    },
    marketPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',
    },
    marketChange: {
        fontSize: 14,
        textAlign: 'right',
    },
});

