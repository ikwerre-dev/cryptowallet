import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const SEED_PHRASE = [
    'then', 'vacant', 'girl', 'exist', 'avoid', 'usage',
    'ride', 'alien', 'comic', 'cross', 'upon', 'hub'
];

export default function ConfirmSeedPhraseScreen({ navigation }) {
    const [selectedWords, setSelectedWords] = useState([]);
    const [remainingWords] = useState([...SEED_PHRASE].sort(() => Math.random() - 0.5));

    const handleWordSelect = useCallback((word) => {
        if (selectedWords.includes(word)) {
            setSelectedWords(prev => prev.filter(w => w !== word));
        } else {
            setSelectedWords(prev => [...prev, word]);
        }
    }, [selectedWords]);

    const isCorrectOrder = useCallback(() => {
        return selectedWords.every((word, index) => word === SEED_PHRASE[index]);
    }, [selectedWords]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>2/3</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Confirm Seed Phrase</Text>
                <Text style={styles.description}>
                    Select each word in the order it was presented to you
                </Text>

                <View style={styles.selectedWordsContainer}>
                    {SEED_PHRASE.map((_, index) => (
                        <View 
                            key={index} 
                            style={[
                                styles.wordSlot,
                                selectedWords[index] && styles.wordSlotFilled
                            ]}
                        >
                            {selectedWords[index] && (
                                <Text style={styles.selectedWord}>
                                    {selectedWords[index]}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.wordGrid}>
                    {remainingWords.map((word, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.wordButton,
                                selectedWords.includes(word) && styles.wordButtonSelected
                            ]}
                            onPress={() => handleWordSelect(word)}
                        >
                            <Text style={[
                                styles.wordButtonText,
                                selectedWords.includes(word) && styles.wordButtonTextSelected
                            ]}>
                                {word}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        (!selectedWords.length || selectedWords.length !== SEED_PHRASE.length) && 
                        styles.buttonDisabled
                    ]}
                    disabled={!selectedWords.length || selectedWords.length !== SEED_PHRASE.length}
                    onPress={() => {
                        if (isCorrectOrder()) {
                            navigation.navigate('SeedPhraseSuccess');
                        } else {
                            navigation.navigate('SeedPhraseSuccess');

                            setSelectedWords([]);
                            
                        }
                    }}
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
    },
    selectedWordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 32,
    },
    wordSlot: {
        width: '31%',
        aspectRatio: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wordSlotFilled: {
        backgroundColor: '#E8F5E9',
        borderColor: '#4CAF50',
    },
    selectedWord: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    wordGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 32,
    },
    wordButton: {
        width: '31%',
        aspectRatio: 3,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wordButtonSelected: {
        backgroundColor: '#E0E0E0',
    },
    wordButtonText: {
        color: '#000',
        fontWeight: '500',
    },
    wordButtonTextSelected: {
        opacity: 0.5,
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