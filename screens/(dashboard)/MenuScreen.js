import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: 'account-outline', title: 'Profile', screen: 'Profile' },
    { icon: 'clock-outline', title: 'Transactions', screen: 'Transactions' },
    { icon: 'chart-box-outline', title: 'My Portfolio', screen: 'Portfolio' },
    { icon: 'help-circle-outline', title: 'Help and Support', screen: 'Support' },
    { icon: 'file-document-outline', title: 'Terms and Conditions', screen: 'Terms' },
    { icon: 'power', title: 'Logout', screen: 'Logout' },
  ];

  const MenuItem = ({ icon, title, screen }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() =>
      {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
         title == 'Logout' ? logout() :  navigation.navigate(screen)        
        
      }    
    }
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={22} color="#000" />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  menuContainer: {
    backgroundColor: '#121212',
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    marginTop:20
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingVertical:15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 17,
    color: '#fff',
  },
});

export default SettingsScreen;
