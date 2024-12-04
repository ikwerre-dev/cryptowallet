import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TransactionsScreen = () => {
  const [activeTab, setActiveTab] = useState('History');
  
  const transactions = [
    {
      id: '1',
      type: 'Bitcoin Purchase',
      amount: '$32,450.10',
      cryptoAmount: '0.89 BTC',
      timestamp: '9:01am',
      percentageChange: '+4.5%',
      icon: 'bitcoin',
      status: 'completed',
    },
    {
      id: '2',
      type: 'Ethereum Transfer',
      amount: '$2,800.00',
      cryptoAmount: '1.2 ETH',
      timestamp: '5:01am 2024-01-12',
      percentageChange: '-1.5%',
      icon: 'ethereum',
      status: 'completed',
    },
    {
      id: '3',
      type: 'USDT Received',
      amount: '$1,000.00',
      cryptoAmount: '1000 USDT',
      timestamp: '7:02pm 2024-01-13',
      percentageChange: '0%',
      icon: 'currency-usd',
      status: 'completed',
    },
  ];

  const renderTransaction = (transaction) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={transaction.icon} 
            size={24} 
            color="#FFF" 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>{transaction.type}</Text>
          <Text style={styles.timestamp}>{transaction.timestamp}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.amount}>{transaction.amount}</Text>
        <Text style={styles.cryptoAmount}>{transaction.cryptoAmount}</Text>
        <Text style={[
          styles.percentageChange,
          { color: transaction.percentageChange.includes('+') ? '#4CAF50' : '#FF5252' }
        ]}>
          {transaction.percentageChange}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
 


      <ScrollView style={styles.transactionList}>
        {transactions.map(renderTransaction)}
      </ScrollView>
    </SafeAreaView>
  );
};

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
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    color: '#888888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    justifyContent: 'center',
  },
  transactionType: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  timestamp: {
    color: '#888888',
    fontSize: 14,
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  cryptoAmount: {
    color: '#888888',
    fontSize: 14,
    marginTop: 2,
  },
  percentageChange: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default TransactionsScreen;