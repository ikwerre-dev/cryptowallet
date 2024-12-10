import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SeedPhraseScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>2/3</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>What is a 'Seed phrase'</Text>

                <Image
                    source={require('../../assets/(auth)/shield.png')}
                    style={styles.image}
                />

                <Text style={styles.description}>
                    A seed phrase is a set of twelve words that contains all the information about your
                    wallet, including your funds. It's like a secret code used to access your entire wallet.
                </Text>

                <Text style={styles.warning}>
                    You must keep your seed phrase secret and safe. If someone gets your seed phrase,
                    they'll gain control over your accounts.
                </Text>

                <Text style={styles.tip}>
                    Save it in a place where only you can access it. If you lose it, not even Cryptooly
                    can help you recover it.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SeedPhraseReveal')}
                >
                    <Text style={styles.buttonText}>I Got It</Text>
                </TouchableOpacity>
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
        marginBottom: 24,
    },
    warning: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    tip: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 16,
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});