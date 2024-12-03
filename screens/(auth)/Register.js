import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Checkbox from '../components/Checkbox';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../../context/AuthContext';

export default function CreatePasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [understood, setUnderstood] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const { login } = useAuth();

    const passwordStrength = password.length >= 8 ? 'Good' : 'Weak';

    const handleFaceIdToggle = async (value) => {
        if (value) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert('Error', 'Your device does not support Face ID');
                return;
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert('Error', 'Face ID is not set up on your device');
                return;
            }

            const result = await LocalAuthentication.authenticateAsync();
            if (result.success) {
                setFaceIdEnabled(true);
            } else {
                Alert.alert('Error', 'Face ID authentication failed');
            }
        } else {
            setFaceIdEnabled(false);
        }
    };

    const handleLogin = () => {
        const token = 'example-token'; // Replace with a token from your backend
        login({ loginEmail, token });
    };

    const renderLoginModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showLoginModal}
            onRequestClose={() => setShowLoginModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Login</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Email"
                        value={loginEmail}
                        onChangeText={setLoginEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#666"
                    />
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Password"
                        value={loginPassword}
                        onChangeText={setLoginPassword}
                        secureTextEntry
                        placeholderTextColor="#666"
                    />
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleLogin}

                     
                    >
                        <Text style={styles.modalButtonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => {
                            // Handle login logic here
                            setShowLoginModal(false);
                        }}
                                            >
                        <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

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
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#666"
                    />
                </View>

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
                        onValueChange={handleFaceIdToggle}
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

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => setShowLoginModal(true)}
                >
                    <Text style={styles.loginButtonText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>

            {renderLoginModal()}
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
    loginButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#2196F3',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 24,
        width: '100%',
        paddingBottom: '50%',
        paddingTop: '5%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    modalButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalCloseButton: {
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

