import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from '../components/Checkbox';

export default function RemindLaterScreen({ navigation }) {
    const [understood, setUnderstood] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>2/3</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Skip Account Security?</Text>

                <Image
                    source={require('../../assets/(auth)/shield.png')}
                    style={styles.image}
                />

                <Text style={styles.description}>
                    Don't risk losing your funds. protect your wallet by saving your{' '}
                    <Text style={styles.highlight}>seed phrase</Text> in a place you trust.{' '}
                    <Text style={styles.highlight}>
                        It's the only way to recover your wallet if you get locked out of the app
                        or get a new device.
                    </Text>
                </Text>

                <View style={styles.checkboxContainer}>
                    <Checkbox
                        checked={understood}
                        onPress={() => setUnderstood(!understood)}
                    />
                    <Text style={styles.checkboxText}>
                        I understand that if I lose my seed phrase I will not be able to access my wallet
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('SeedPhraseReveal')}
                    >
                        <Text style={styles.secondaryButtonText}>Secure Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryButton, !understood && styles.buttonDisabled]}
                        disabled={!understood}
                        onPress={() => navigation.navigate('SeedPhraseSuccess')}
                    >
                        <Text style={styles.primaryButtonText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
    },
    backButton: {
        fontSize: 24,
    },
    headerText: {
        color: '#666',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 32,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    highlight: {
        color: '#000',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    checkboxText: {
        flex: 1,
        marginLeft: 12,
        color: '#666',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 'auto',
        gap: 16,
    },
    primaryButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});