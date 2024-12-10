import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SeedPhraseSuccessScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const SkipSignup = async () => {
        try {
            const user = JSON.parse(await AsyncStorage.getItem('temp_user'));
            const user_id = await AsyncStorage.getItem('temp_user_id');
            
            // Check if user exists and user_id is valid before calling login
            if (user && user_id) {
                login({ user, user_id });
            } else {
                console.error('User data or user ID is missing');
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>3/3</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../../assets/(auth)/success-icon.png')}
                        style={styles.icon}
                    />
                </View>

                <Text style={styles.title}>Congratulations</Text>
                <Text style={styles.description}>
                    You've successfully protected your wallet. Remember to keep your seed phrase safe,
                    it's your responsibility!
                </Text>

                <TouchableOpacity onPress={() => {}} style={styles.hintButton}>
                    <Text style={styles.hintText}>Leave yourself a hint?</Text>
                </TouchableOpacity>

                <Text style={styles.warning}>
                    Cryptooly cannot recover your wallet should you lose it. You can find your seedphrase in{' '}
                    <Text style={styles.highlight}>Setting {'>'} Security & Privacy</Text>
                </Text>

                <TouchableOpacity onPress={() => {}} style={styles.learnMoreButton}>
                    <Text style={styles.learnMoreText}>Learn more</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={SkipSignup}
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
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 32,
    },
    icon: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    hintButton: {
        marginBottom: 24,
    },
    hintText: {
        color: '#2196F3',
        fontSize: 16,
    },
    warning: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    highlight: {
        color: '#000',
        fontWeight: '500',
    },
    learnMoreButton: {
        marginBottom: 32,
    },
    learnMoreText: {
        color: '#2196F3',
        fontSize: 16,
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