import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const SEED_PHRASE = [
    'then', 'vacant', 'girl', 'exist', 'avoid', 'usage',
    'ride', 'alien', 'comic', 'cross', 'upon', 'hub'
];

export default function SeedPhraseRevealScreen({ navigation }) {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>2/3</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Write Down Your Seed Phrase</Text>
                <Text style={styles.description}>
                    This is your seed phrase. Write it down on a paper and keep it in a safe place. You'll
                    be asked to re-enter this phrase (in order) on the next step.
                </Text>

                <View style={styles.seedPhraseContainer}>
                    {!isRevealed ? (
                        <Pressable 
                            style={styles.revealButton}
                            onPress={() => setIsRevealed(true)}
                        >
                            <Feather name="eye-off" size={24} color="#fff" />
                            <Text style={styles.revealText}>Tap to reveal your seed phrase</Text>
                            <Text style={styles.revealSubtext}>
                                Make sure no one is watching your screen.
                            </Text>
                        </Pressable>
                    ) : (
                        <View style={styles.wordsGrid}>
                            {SEED_PHRASE.map((word, index) => (
                                <View key={index} style={styles.wordContainer}>
                                    <Text style={styles.wordNumber}>{index + 1}.</Text>
                                    <Text style={styles.word}>{word}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.button, !isRevealed && styles.buttonDisabled]}
                    disabled={!isRevealed}
                    onPress={() => navigation.navigate('ConfirmSeedPhrase')}
                >
                    <Text style={styles.buttonText}>Continue</Text>
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
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        color: '#666',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
        lineHeight: 24,
    },
    seedPhraseContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    revealButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        borderRadius: 8,
    },
    revealText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    revealSubtext: {
        color: '#fff',
        opacity: 0.7,
        marginTop: 8,
    },
    wordsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    wordContainer: {
        flexDirection: 'row',
        width: '48%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    wordNumber: {
        color: '#666',
        marginRight: 8,
    },
    word: {
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});