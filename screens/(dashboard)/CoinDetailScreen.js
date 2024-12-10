import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { ArrowLeft, Heart } from 'react-native-feather';

const TimeButton = React.memo(({ label, active, onPress }) => (
    <TouchableOpacity
        style={[styles.timeButton, active && styles.timeButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.timeButtonText, active && styles.timeButtonTextActive]}>
            {label}
        </Text>
    </TouchableOpacity>
));

const formatNumber = (number) => {
    if (number >= 1_000_000_000_000) return `${(number / 1_000_000_000_000).toFixed(2)}T`;
    if (number >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(2)}B`;
    if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(2)}M`;
    if (number >= 1_000) return `${(number / 1_000).toFixed(2)}K`;
    return number;
};

const getDataPointsCount = (timeFrame) => {
    switch (timeFrame) {
        case '1H': return 12;  // 5-minute intervals
        case '1D': return 48;  // 30-minute intervals
        case '1W': return 84;  // 2-hour intervals
        case '1M': return 60;  // 12-hour intervals
        case '1Y': return 365; // daily intervals
        case 'All': return 1000; // all available data
        default: return 48;
    }
};

export default function CoinDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const [activeTime, setActiveTime] = useState('1D');
    const [coinData, setCoinData] = useState({ prices: [] });
    const [tooltipData, setTooltipData] = useState(null);

    const fetchCoinData = useCallback(async () => {
        try {
            const res = await fetch(
                `https://api.coincap.io/v2/assets/${item.id}/history?interval=m1`
            );
            const response = await res.json();
            console.log('coin data fetched')
            setCoinData({
                prices: response.data.map(point => [
                    new Date(point.time).getTime(),
                    parseFloat(point.priceUsd)
                ])
            });
        } catch (error) {
            console.error('Error fetching coin data:', error);
        }
    }, [item.id]);

    useEffect(() => {
        fetchCoinData();
        const intervalId = setInterval(fetchCoinData, 2000);
        return () => clearInterval(intervalId);
    }, [fetchCoinData]);

    const renderTimeButtons = useCallback(() => (
        <View style={styles.timeButtons}>
            {['1H', '1D', '1W', '1M', '1Y', 'All'].map((label) => (
                <TimeButton
                    key={label}
                    label={label}
                    active={activeTime === label}
                    onPress={() => setActiveTime(label)}
                />
            ))}
        </View>
    ), [activeTime]);

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
                        source={{ uri: `https://cryptologos.cc/logos/${item.full_name.toLowerCase().replace(/\s+/g, '-')}-${item.symbol.toLowerCase()}-logo.png` }} style={styles.coinIcon}
                    />
                    <Text style={styles.coinName}>
                        {item.full_name} / {item.symbol}
                    </Text>
                </View>
                <Text style={styles.coinPrice}>${item.balance}</Text>
                <Text style={[styles.priceChange, { color: item.changePercent24Hr >= 0 ? '#4A8CFF' : '#F44336' }]}>
                    {item.changePercent24Hr >= 0 ? '↑' : '↓'}{Math.abs(parseFloat(item.changePercent24Hr)).toFixed(2)}%
                </Text>
            </View>

            <View style={styles.stats}>
                {[
                    { label: 'POPULARITY', value: `#${item.rank}` },
                    { label: 'MARKET CAP', value: formatNumber(item.marketcap) },
                    { label: 'Price(USD)', value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.priceUsd) },
                ].map(({ label, value }) => (
                    <View key={label} style={styles.statItem}>
                        <Text style={styles.statLabel}>{label}</Text>
                        <Text style={styles.statValue}>{value}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.chartContainer}>
                {renderTimeButtons()}
                {coinData.prices.length > 0 ? (
                    <LineChart
                        data={{
                            labels: coinData.prices.slice(-getDataPointsCount(activeTime)).map((price) =>
                                new Date(price[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            ),
                            datasets: [{
                                data: coinData.prices.slice(-getDataPointsCount(activeTime)).map((price) => price[1])
                            }],
                        }}
                        width={350}
                        height={220}
                        indexAxis={'x'}
                        chartConfig={{
                            backgroundColor: '#000',
                            backgroundGradientFrom: '#000',
                            backgroundGradientTo: '#000',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(74, 140, 255, ${opacity})`,
                            propsForDots: {
                                r: "0",
                            },
                            propsForBackgroundLines: {
                                strokeDasharray: "", // Solid background lines
                            },
                            formatYLabel: (value) => `${value} USD`, // This line adds USD to horizontal labels

                        }}
                        bezier
                        style={styles.chart}
                        withDots={false}
                        withInnerLines={true}
                        withOuterLines={true}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        withVerticalLabels={false}
                        withHorizontalLabels={true}
                        decorator={() => {
                            return tooltipData ? (
                                <View style={styles.tooltipContainer}>
                                    <Text style={styles.tooltipText}>${tooltipData.toFixed(2)}</Text>
                                </View>
                            ) : null;
                        }}
                        onDataPointClick={({ value, dataset, getColor }) => {
                            setTooltipData(value);
                        }}
                    />
                ) : (
                    <Text style={styles.noDataText}>No data available</Text>
                )}

            </View>

            <View style={styles.priceRange}>
                <Text style={styles.priceRangeLabel}>Supply ${formatNumber(item.supply)}</Text>
                <Text style={styles.priceRangeLabel}>MAX ${formatNumber(item.maxSupply)}</Text>
            </View>
            <TouchableOpacity 
                    onPress={() => navigation.navigate('Send')}
            style={styles.transferButton}>
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
    tooltipContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        borderRadius: 5,
    },
    tooltipText: {
        color: 'white',
        fontSize: 14,
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
        justifyContent: 'center',
        alignItems: 'center'
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
        paddingHorizontal: 25
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
    noDataText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
