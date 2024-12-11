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
import { useAuth } from '../../context/AuthContext';

const TransactionsScreen = () => {
  const [activeTab, setActiveTab] = useState('History');
  
  
  const { user, userId,transactions } = useAuth();
  
  console.log(transactions)

  const renderTransaction = (transaction) => (
    <View key={`${transaction.id}-${transaction.source}`} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={transaction.source === 'transfer' ? 'bank-transfer' : 
                  transaction.source === 'swap' ? 'swap-horizontal' : 
                  transaction.source === 'p2p' ? 'account-multiple' : 
                  'cash'} 
            size={24} 
            color="#FFF" 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {transaction.source.charAt(0).toUpperCase() + transaction.source.slice(1)}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(transaction.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.amount}>${parseFloat(transaction.amount).toFixed(2)}</Text>
      </View>
    </View>
  );

  

  return (
    <SafeAreaView style={styles.container}>
 


      <ScrollView style={styles.transactionList}>
        {transactions.length > 0 && transactions.map(renderTransaction)}
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