import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

export default function ProfileScreen() {
  const navigation = useNavigation(); // Initialize navigation

  const menuItems = [
    { icon: 'person-outline', title: 'Profile', screen: 'HistoryScreen' },
    { icon: 'time-outline', title: 'History', screen: 'HistoryScreen' },
    { icon: 'person-outline', title: 'My Portfolio', screen: 'Portfolio' }, // Add the new Portfolio screen
    { icon: 'help-circle-outline', title: 'Help and Support', screen: 'Support' },
    { icon: 'document-text-outline', title: 'Terms and Conditions', screen: 'Terms' },
    { icon: 'power', title: 'Logout', screen: 'Logout' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
    
        <Text style={styles.name}>Agilan Senthil</Text>
        <Text style={styles.email}>agilansenthilkumar@gmail.com</Text>
        <Text style={styles.phone}>+91 9444977118</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)} // Navigate to the selected screen
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color="#7B61FF" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#7B61FF',
    padding: 20,
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
    color: '#fff',
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#fff',
  },
});
