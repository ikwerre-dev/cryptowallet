import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NotificationScreen = () => {
//   const [notifications] = useState([]);  // Empty array for empty state demo
  const [notifications] = useState([
    {
        id: '1',
        title: 'Security Updates!',
        message: 'Now Coino has a Two-Factor Authentication. Try it now to make your account more secure.',
        time: '09:24 AM',
        date: 'Today',
        icon: 'shield-check',
        isNew: true,
      },
      {
        id: '1',
        title: 'Security Updates!',
        message: 'Now Coino has a Two-Factor Authentication. Try it now to make your account more secure.',
        time: '09:24 AM',
        date: 'Today',
        icon: 'shield-check',
        isNew: true,
      },
      {
        id: '1',
        title: 'Security Updates!',
        message: 'Now Coino has a Two-Factor Authentication. Try it now to make your account more secure.',
        time: '09:24 AM',
        date: 'Today',
        icon: 'shield-check',
        isNew: true,
      },
      {
        id: '1',
        title: 'Security Updates!',
        message: 'Now Coino has a Two-Factor Authentication. Try it now to make your account more secure.',
        time: '09:24 AM',
        date: 'Today',
        icon: 'shield-check',
        isNew: true,
      },
    // Add more notifications as needed
  ]);
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      {/* <Image
        source={require('./assets/clipboard.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      /> */}
      <Text style={styles.emptyTitle}>Empty</Text>
      <Text style={styles.emptyText}>
        You don't have any notification at this time
      </Text>
    </View>
  );

  const NotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationIcon}>
        <MaterialCommunityIcons 
          name={item.icon} 
          size={24} 
          color="#FFF"
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          )}
        </View>
        <Text style={styles.notificationTime}>
          {item.time} | {item.date}
        </Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView style={styles.notificationList}>
          {notifications.map((notification, index) => (
            <NotificationItem key={index} item={notification} />
          ))}
        </ScrollView>
      )}
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
    backgroundColor: '#121212',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    tintColor: '#444444',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  notificationList: {
    flex: 1,
    paddingTop:20

  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
});

export default NotificationScreen;