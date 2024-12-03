import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PersonalDetailsScreen = () => {
  const [formData, setFormData] = useState({
    name: 'Ulvin Omarov',
    email: 'info@ulvin.com',
    date: '01.01.2024',
    phone: '+994 12 345 67 89',
    country: 'United States',
    city: 'San Francisco',
    postalCode: 'CA12345',
  });

  const handleSave = () => {
    // Handle save functionality
    console.log('Saving form data:', formData);
  };

  const InputField = ({ icon, value, placeholder, onChangeText }) => (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons name={icon} size={20} color="#666" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666"
      />
    </View>
  );

  const SelectField = ({ icon, value, onPress }) => (
    <TouchableOpacity style={styles.inputContainer} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={20} color="#666" style={styles.inputIcon} />
      <Text style={styles.selectText}>{value}</Text>
      <MaterialCommunityIcons name="chevron-down" size={20} color="#666" style={styles.chevron} />
    </TouchableOpacity>
  );

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal</Text>
          <InputField
            icon="account"
            value={formData.name}
            placeholder="Full Name"
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <InputField
            icon="email"
            value={formData.email}
            placeholder="Email"
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <InputField
            icon="calendar"
            value={formData.date}
            placeholder="Date"
            onChangeText={(text) => setFormData({ ...formData, date: text })}
          />
          <InputField
            icon="phone"
            value={formData.phone}
            placeholder="Phone"
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <SelectField
            icon="map-marker"
            value={formData.country}
            onPress={() => console.log('Open country selector')}
          />
          <SelectField
            icon="city"
            value={formData.city}
            onPress={() => console.log('Open city selector')}
          />
          <InputField
            icon="post"
            value={formData.postalCode}
            placeholder="Postal Code"
            onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  chevron: {
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PersonalDetailsScreen;

