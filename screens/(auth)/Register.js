import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Checkbox from '../components/Checkbox';

export default function CreatePasswordScreen({ navigation }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [understood, setUnderstood] = useState(false);

    const passwordStrength = password.length >= 8 ? 'Good' : 'Weak';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>1/3</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.title}>Create Password</Text>
                <Text style={styles.subtitle}>
                    This password will unlock your Cryptooly wallet only on this service
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="New password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#666"
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.strengthText, { color: passwordStrength === 'Good' ? '#4CAF50' : '#666' }]}>
                    Password strength: {passwordStrength}
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm password"
                        secureTextEntry={!showPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor="#666"
                    />
                    {confirmPassword && password === confirmPassword && (
                        <View style={styles.checkIcon}>
                            <Feather name="check" size={24} color="#4CAF50" />
                        </View>
                    )}
                </View>

                <Text style={styles.requirement}>Must be at least 8 characters</Text>

                <View style={styles.faceIdContainer}>
                    <Text style={styles.faceIdText}>Sign in with Face ID?</Text>
                    <Switch
                        value={faceIdEnabled}
                        onValueChange={setFaceIdEnabled}
                        trackColor={{ false: '#767577', true: '#000' }}
                        thumbColor={faceIdEnabled ? '#4CAF50' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.checkboxContainer}>
                    <Checkbox
                        checked={understood}
                        onPress={() => setUnderstood(!understood)}
                    />
                    <Text style={styles.checkboxText}>
                        I understand that Cryptooly cannot recover this password for me.{' '}
                        <Text style={styles.learnMore}>Learn more</Text>
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, !understood && styles.buttonDisabled]}
                    disabled={!understood}
                    onPress={() => navigation.navigate('SecureWallet')}
                >
                    <Text style={styles.buttonText}>Create Password</Text>
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
        padding: 16,
        alignItems: 'flex-end',
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
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    checkIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    strengthText: {
        marginBottom: 16,
    },
    requirement: {
        color: '#666',
        marginBottom: 24,
    },
    faceIdContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    faceIdText: {
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    checkboxText: {
        flex: 1,
        marginLeft: 12,
        color: '#666',
    },
    learnMore: {
        color: '#2196F3',
        textDecorationLine: 'underline',
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