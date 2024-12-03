import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Terms and Conditions</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to our app. By using our services, you agree to comply with the terms and conditions outlined below.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Use of Service</Text>
        <Text style={styles.text}>
          You may not use the service for any unlawful purpose. Your access to the service may be suspended or terminated if you violate these terms.
        </Text>
        
        <Text style={styles.sectionTitle}>3. Privacy</Text>
        <Text style={styles.text}>
          We are committed to protecting your privacy. Our privacy policy outlines how we collect, use, and protect your personal information.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Changes to Terms</Text>
        <Text style={styles.text}>
          We reserve the right to update or change these terms at any time. Any changes will be communicated through the app or via email.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.text}>
          If you have any questions about these terms, feel free to contact us at support@example.com.
        </Text>
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
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff'
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
    color: '#ccc',
  },
});
