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
          Welcome to our crypto app. By using our platform, you agree to comply with the terms and conditions outlined here. Please read them carefully before using our services.
        </Text>

        <Text style={styles.sectionTitle}>2. Account Usage</Text>
        <Text style={styles.text}>
          Users are responsible for maintaining the confidentiality of their account credentials. You must not share your login information or use another user’s account without authorization.
        </Text>

        <Text style={styles.sectionTitle}>3. Cryptocurrency Transactions</Text>
        <Text style={styles.text}>
          All transactions, including deposits, withdrawals, and trades, are final once confirmed on the blockchain. Ensure that you review transaction details carefully before proceeding.
        </Text>

        <Text style={styles.sectionTitle}>4. Fees</Text>
        <Text style={styles.text}>
          We may charge fees for transactions or other services. Fees are displayed transparently in the app and are subject to change. You agree to pay all applicable fees.
        </Text>

        <Text style={styles.sectionTitle}>5. Risk Disclaimer</Text>
        <Text style={styles.text}>
          Trading cryptocurrencies involves significant risk, including the risk of losing all your funds. You acknowledge that you are solely responsible for any losses and understand the volatile nature of cryptocurrencies.
        </Text>

        <Text style={styles.sectionTitle}>6. Privacy</Text>
        <Text style={styles.text}>
          We value your privacy and are committed to safeguarding your data. Refer to our Privacy Policy to understand how your information is collected and used.
        </Text>

        <Text style={styles.sectionTitle}>7. Prohibited Activities</Text>
        <Text style={styles.text}>
          You agree not to use our platform for illegal activities, including but not limited to money laundering, fraud, or any activities that violate applicable laws.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.text}>
          We reserve the right to update these terms at any time. Changes will be communicated through the app or via email. Continued use of the app indicates your acceptance of the updated terms.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions regarding these terms, please reach out to our support team at support@cryptoapp.com.
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
    color: '#fff',
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
    color: '#ccc',
  },
});
