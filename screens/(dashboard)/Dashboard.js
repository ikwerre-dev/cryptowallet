import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Bell, X, Eye, EyeOff, ArrowRight, ArrowDown, ArrowUp, Repeat } from 'react-native-feather';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';

const cryptoData = [
    { symbol: "BTC", name: "Bitcoin", price: 6780, change: 11.75 },
    { symbol: "ETH", name: "Ethereum", price: 1478.1, change: 4.7 },
    { symbol: "ADA", name: "Cardano", price: 123.77, change: 11.75 },
    { symbol: "UNI", name: "Uniswap", price: 16.96, change: -11.75 },
    { symbol: "USDT", name: "Tether", price: 0.98, change: 0.15 },
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
            <Text style={[styles.cryptoChange, { color: change >= 0 ? '#fff' : '#fff' }]}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </Text>
        </View>
    </TouchableOpacity>
);


const MarketItem = ({ icon, name, symbol, price, change, chartData, onPress }) => {
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
                <Image source={{ uri: `https://cryptologos.cc/logos/${name.toLowerCase()}-${symbol.toLowerCase()}-logo.png` }} style={styles.marketIcon} />

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

export default function DashboardScreen() {
    const navigation = useNavigation();
    const [showBalance, setShowBalance] = React.useState(true);
    const [shakeCount, setShakeCount] = useState(0);
    const [lastShakeTime, setLastShakeTime] = useState(0);
  
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
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=14' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity onPress={handleNotificationPress}>
                        <Bell stroke="#fff" width={24} height={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.balance}>
                    <Text style={styles.balanceLabel}>Portfolio Balance</Text>
                    <TouchableOpacity  onPress={toggleBalanceVisibility} style={styles.balanceRow}>
                        {showBalance ? (
                            <Text style={styles.balanceAmount}>$12,550.50</Text>
                        ) : (
                            <Text style={styles.balanceAmount}>•••••••</Text>
                        )}
                        <TouchableOpacity onPress={toggleBalanceVisibility}>
                            {showBalance ? (
                                <Eye stroke="#fff" width={24} height={24} style={styles.eyeIcon} />
                            ) : (
                                <EyeOff stroke="#fff" width={24} height={24} style={styles.eyeIcon} />
                            )}
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <View style={styles.balanceChange}>
                        <Text style={styles.balanceChangeText}>↑ 10.75%</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleButtonPress('Receive')}
                    >
                        <Text style={styles.buttonText}><ArrowDown color={'white'}  /></Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleButtonPress('Send')}
                    >
                        <Text style={styles.buttonText}><ArrowUp color={'white'} /></Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleButtonPress('Swap')}
                    >
                        <Text style={styles.buttonText}><Repeat color={'white'} /></Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.portfolio}>
                    <View style={styles.portfolioHeader}>
                        <Text style={styles.portfolioTitle}>Pinned Portfolio</Text>
                        <TouchableOpacity style={styles.filtertouchableContainer}>
                            <Text style={styles.portfolioFilter}>
                                View All
                            </Text>
                            <ArrowRight width={15} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                        {cryptoData.slice(0, 2).map((crypto) => (
                            <CryptoCard
                                key={crypto.symbol}
                                symbol={crypto.symbol}
                                name={crypto.name}
                                price={crypto.price}
                                change={crypto.change}
                                color="#7B61FF"

                                onPress={() => handlePortfolioPress(crypto)}
                            />
                        ))}

                    </ScrollView>
                </View>


                {/* <View style={styles.referral}>
                    <View style={styles.referralContent}>
                        <View>
                            <Text style={styles.referralTitle}>Connect for Interlinking</Text>
                            <Text style={styles.referralDescription}>
                                Connect your external wallet for interlinking
                            </Text>
                        </View>

                    </View>
                    <TouchableOpacity style={styles.closeButton}>
                        <X stroke="#fff" width={20} height={20} />
                    </TouchableOpacity>
                </View> */}

                <View style={styles.market}>
                    <Text style={styles.marketTitle}>My Portfolio</Text>
                    {cryptoData.map((crypto) => (

                        <MarketItem
                            key={crypto.symbol}
                            symbol={crypto.symbol}
                            name={crypto.name}
                            price={crypto.price}
                            change={crypto.change}
                            onPress={() => handlePortfolioPress(crypto)}
                            chartData={[40, 45, 35, 50, 49, 60, 70, 91, 85, 87, 80, 75, 85]}
                        />
                    ))}

                </View>
            </ScrollView>
        </SafeAreaView>
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
        paddingVertical:5

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
        paddingBottom: 5
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
        color: '#fff',
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

