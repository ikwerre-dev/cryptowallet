import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

const TransactionsScreen = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { transactions } = useAuth();
  
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const renderTransaction = (transaction) => (
    <TouchableOpacity
      key={`${transaction.id}-${transaction.source}`}
      style={styles.transactionItem}
      onPress={() => handleTransactionClick(transaction)}
    >
      <View style={styles.transactionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor(transaction.source) }]}>
          <MaterialCommunityIcons
            name={getIconName(transaction.source)}
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
        <Text style={[styles.amount, { color: transaction.amount > 0 ? '#4CAF50' : '#F44336' }]}>
          {transaction.amount > 0 ? '+' : '-'}${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getIconName = (source) => {
    switch (source) {
      case 'transfer': return 'bank-transfer';
      case 'swap': return 'swap-horizontal';
      case 'p2p': return 'account-multiple';
      default: return 'cash';
    }
  };

  const getIconColor = (source) => {
    switch (source) {
      case 'transfer': return '#2196F3';
      case 'swap': return '#FF9800';
      case 'p2p': return '#4CAF50';
      default: return '#9C27B0';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.transactionList}>
        {transactions && transactions.length > 0 && transactions.map(renderTransaction)}
      </ScrollView>

      {selectedTransaction && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#FFF" />
              </Pressable>
              <Text style={styles.modalHeaderTitle}>Transaction Details</Text>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.transactionIconLarge}>
                <MaterialCommunityIcons
                  name={getIconName(selectedTransaction.source)}
                  size={48}
                  color="#FFF"
                />
              </View>
              <Text style={styles.transactionAmount}>
                {selectedTransaction.amount > 0 ? '+' : '-'}${Math.abs(parseFloat(selectedTransaction.amount)).toFixed(2)}
              </Text>
              <Text style={styles.transactionStatus}>Completed</Text>
              <View style={styles.detailsContainer}>
                <DetailRow label="Date" value={new Date(selectedTransaction.created_at).toLocaleString()} />
                <DetailRow label="Transaction Type" value={selectedTransaction.source.toUpperCase()} />
                <DetailRow label="To" value={selectedTransaction.wallet_address && selectedTransaction.wallet_address.slice(0, 35) + '...'} />
                <DetailRow label="Network Fee" value={"$" + (selectedTransaction.amount  * 0.005)} />
                <DetailRow label="Crypto Amount" value={`$${parseFloat(selectedTransaction.amount).toFixed(2)} (${selectedTransaction.cryptocurrency})`} />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  closeButton: {
    padding: 8,
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  transactionIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  transactionAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  transactionStatus: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  detailLabel: {
    color: '#888888',
    fontSize: 14,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TransactionsScreen;

