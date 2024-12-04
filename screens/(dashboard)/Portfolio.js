import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Bell, X, Eye, EyeOff, ArrowRight } from 'react-native-feather';
import * as Haptics from 'expo-haptics';

const cryptoData = [
    { symbol: "BTC", name: "Bitcoin", price: 6780, change: 11.75, logo: `https://cryptologos.cc/logos/bitcoin-btc-logo.png` },
    { symbol: "ETH", name: "Ethereum", price: 1478.1, change: 4.7, logo: `https://cryptologos.cc/logos/ethereum-eth-logo.png` },
    { symbol: "ADA", name: "Cardano", price: 123.77, change: 11.75, logo: `https://cryptologos.cc/logos/cardano-ada-logo.png` },
    { symbol: "UNI", name: "Uniswap", price: 16.96, change: -11.75, logo: `https://cryptologos.cc/logos/uniswap-uni-logo.png` },
    { symbol: "USDT", name: "Tether", price: 0.98, change: 0.15, logo: `https://cryptologos.cc/logos/tether-usdt-logo.png` },
    { symbol: "BNB", name: "Binance Coin", price: 330.22, change: 5.5, logo: `https://cryptologos.cc/logos/binance-coin-bnb-logo.png` },
    { symbol: "SOL", name: "Solana", price: 140.65, change: 2.3, logo: `https://cryptologos.cc/logos/solana-sol-logo.png` },
    { symbol: "XRP", name: "XRP", price: 1.23, change: -3.2, logo: `https://cryptologos.cc/logos/xrp-xrp-logo.png` },
    { symbol: "DOT", name: "Polkadot", price: 34.52, change: 7.2, logo: `https://cryptologos.cc/logos/polkadot-dot-logo.png` },
    { symbol: "LTC", name: "Litecoin", price: 185.44, change: -0.8, logo: `https://cryptologos.cc/logos/litecoin-ltc-logo.png` },
    { symbol: "BCH", name: "Bitcoin Cash", price: 450.32, change: 2.4, logo: `https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png` },
    { symbol: "LINK", name: "Chainlink", price: 28.77, change: 1.1, logo: `https://cryptologos.cc/logos/chainlink-link-logo.png` },
    { symbol: "MATIC", name: "Polygon", price: 2.39, change: 5.6, logo: `https://cryptologos.cc/logos/polygon-matic-logo.png` },
    { symbol: "AVAX", name: "Avalanche", price: 99.54, change: 9.8, logo: `https://cryptologos.cc/logos/avalanche-avax-logo.png` },
    { symbol: "DOGE", name: "Dogecoin", price: 0.38, change: -2.9, logo: `https://cryptologos.cc/logos/dogecoin-doge-logo.png` },
];



const CryptoCard = ({ symbol, name, price, change, color, onPress }) => (
    <TouchableOpacity style={[styles.cryptoCard, { backgroundColor: color }]} onPress={onPress}>
        <View style={styles.cryptoHeader}>
            <Image
                source={{ uri: `https://cryptologos.cc/logos/${name.toLowerCase()}-${symbol.toLowerCase()}-logo.png` }}
                style={styles.cryptoIcon}
            />
            <View>
                <Text style={styles.cryptoSymbol}>{symbol}</Text>
                <Text style={styles.cryptoName}>{name}</Text>
            </View>
        </View>
        <View style={styles.cryptoFooter}>
            <Text style={styles.cryptoPrice}>${price}</Text>
            <Text style={[styles.cryptoChange, { color: change >= 0 ? '#000' : '#000' }]}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </Text>
        </View>
    </TouchableOpacity>
);


const MarketItem = ({ icon, name, symbol, logo, price, change, chartData, onPress }) => {
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
                <Image source={{ uri: logo }} style={styles.marketIcon} />

                <View>
                    <Text style={styles.marketName}>{name}</Text>
                    <Text style={styles.marketSymbol}>{symbol}</Text>
                </View>
            </View>
            <View style={styles.marketItemRight}>

                <View>
                    <Text style={styles.marketPrice}>${price}</Text>
                    <Text style={[styles.marketChange, { color: change >= 0 ? '#4A8CFF' : '#F44336' }]}>
                        {change >= 0 ? '↑' : '↓'}${Math.abs(change)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function PortfolioScreen() {
    const navigation = useNavigation();
    const [showBalance, setShowBalance] = React.useState(true);

    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    };
    const handlePortfolioPress = (item) => {
        navigation.navigate('CoinDetailScreen', { item });
    };

    return (
        <View style={styles.container}>
            <ScrollView>

                <View key={1} style={styles.balance}>
                    <Text style={styles.balanceLabel}>Portfolio Balance</Text>
                    <View style={styles.balanceRow}>
                        {showBalance ? (
                            <Text style={styles.balanceAmount}>$12,550.50</Text>
                        ) : (
                            <Text style={styles.balanceAmount}>•••••••</Text>
                        )}
                        <TouchableOpacity onPress={toggleBalanceVisibility}>
                            {showBalance ? (
                                <Eye stroke="#000" width={24} height={24} style={styles.eyeIcon} />
                            ) : (
                                <EyeOff stroke="#000" width={24} height={24} style={styles.eyeIcon} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.balanceChange}>
                        <Text style={styles.balanceChangeText}>↑ 10.75%</Text>
                    </View>
                </View>



                <View key={2} style={styles.market}>
                    <Text style={styles.marketTitle}>My Portfolio</Text>
                    {cryptoData.map((crypto, index) => (

                        <MarketItem
                            key={index}
                            symbol={crypto.symbol}
                            name={crypto.name}
                            price={crypto.price}
                            change={crypto.change}
                            logo={crypto.logo}
                            onPress={() => handlePortfolioPress(crypto)}
                            chartData={[40, 45, 35, 50, 49, 60, 70, 91, 85, 87, 80, 75, 85]}
                        />
                    ))}

                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 0,
        paddingBottom: 5,
        paddingTop: 100,
        backgroundColor: '#7B61FF'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    balance: {
        padding: 16,
        backgroundColor: '#7B61FF',
        paddingTop: 80,

    },
    balanceLabel: {
        color: '#000',
        fontSize: 16,
        opacity: 0.7,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    balanceAmount: {
        color: '#000',
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
        color: '#4A8CFF',
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
        color: '#000',
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
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    cryptoName: {
        color: '#000',
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
        color: '#000',
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
    },
    marketTitle: {
        color: '#000',
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
        color: '#000',
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

