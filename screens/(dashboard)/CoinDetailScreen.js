import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { ArrowLeft, Heart } from 'react-native-feather';

const TimeButton = ({ label, active, onPress }) => (
    <TouchableOpacity
        style={[styles.timeButton, active && styles.timeButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.timeButtonText, active && styles.timeButtonTextActive]}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default function CoinDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const [activeTime, setActiveTime] = useState('1D');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            data: [
                86.21, 100.32, 95.43, 120.54, 110.65,
                137.88, 115.32, 89.54, 125.65, 130.43
            ]
        }]
    });

    // Function to simulate changing data every second
    const updateChartData = () => {
        setChartData(prevData => {
            const newData = [...prevData.datasets[0].data];
            newData.shift();  // Remove the first element (simulate shifting the data)
            newData.push(Math.random() * 100 + 100);  // Add new random value to the end
            return {
                labels: [...prevData.labels, `T${prevData.labels.length + 1}`], // Add new label
                datasets: [{ data: newData }]
            };
        });
    };

    useEffect(() => {
        const interval = setInterval(updateChartData, 1000); // Update data every second
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const getCoinImage = (coinName) => {
        return coinImages[coinName] || coinImages.Default;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft stroke="#fff" width={24} height={24} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Heart stroke="#fff" width={24} height={24} />
                </TouchableOpacity>
            </View>

            <View style={styles.coinInfo}>
                <View style={styles.coinHeader}>
                    <Image
                        source={{ uri: `https://cryptologos.cc/logos/${item.name.toLowerCase()}-${item.symbol.toLowerCase()}-logo.png` }}
                        style={styles.coinIcon}
                    />
                    <Text style={styles.coinName}>
                        {item.name} / {item.symbol}
                    </Text>
                </View>
                <Text style={styles.coinPrice}>${item.price}</Text>
                <View style={styles.priceChange}>
                    <Text style={styles.priceChangeText}>↑ 11.75%</Text>
                </View>
            </View>

            <View style={styles.stats}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>POPULARITY</Text>
                    <Text style={styles.statValue}>#61</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>MARKET CAP</Text>
                    <Text style={styles.statValue}>$32.4 b</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>VOLUME</Text>
                    <Text style={styles.statValue}>$20.6 b</Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <View style={styles.timeButtons}>
                    <TimeButton label="1H" active={activeTime === '1H'} onPress={() => setActiveTime('1H')} />
                    <TimeButton label="1D" active={activeTime === '1D'} onPress={() => setActiveTime('1D')} />
                    <TimeButton label="1W" active={activeTime === '1W'} onPress={() => setActiveTime('1W')} />
                    <TimeButton label="1M" active={activeTime === '1M'} onPress={() => setActiveTime('1M')} />
                    <TimeButton label="1Y" active={activeTime === '1Y'} onPress={() => setActiveTime('1Y')} />
                    <TimeButton label="All" active={activeTime === 'All'} onPress={() => setActiveTime('All')} />
                </View>

                <LineChart
                    data={chartData}
                    width={350}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#000',
                        backgroundGradientFrom: '#000',
                        backgroundGradientTo: '#000',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(74, 140, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={styles.chart}
                />

                <View style={styles.priceRange}>
                    <View>
                        <Text style={styles.priceRangeLabel}>MIN $86.21</Text>
                    </View>
                    <View>
                        <Text style={styles.priceRangeLabel}>MAX $137.88</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.transferButton}>
                <Text style={styles.transferButtonText}>Transfer</Text>
            </TouchableOpacity>
        </SafeAreaView>
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
        padding: 16,
    },
    coinInfo: {
        padding: 16,
    },
    coinHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    coinIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    coinName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    coinPrice: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    priceChange: {
        backgroundColor: '#1B2B1F',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    priceChangeText: {
        color: '#4CAF50',
        fontSize: 14,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    chartContainer: {
        padding: 16,
    },
    timeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    timeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    timeButtonActive: {
        backgroundColor: '#222',
    },
    timeButtonText: {
        color: '#666',
        fontSize: 14,
    },
    timeButtonTextActive: {
        color: '#fff',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    priceRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    priceRangeLabel: {
        color: '#666',
        fontSize: 12,
    },
    transferButton: {
        backgroundColor: '#4CAF50',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    transferButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});