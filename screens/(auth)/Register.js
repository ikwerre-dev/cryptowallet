import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, Modal, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Checkbox from '../components/Checkbox';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreatePasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [understood, setUnderstood] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const { login } = useAuth();

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        if (!re.test(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    

    const createaccount = async () => {
        const payload = {
            email: email,
            password: password,
            confirm_password: confirmPassword,
            account_pin: pin,
        };
    
        try {
            const response = await axios.post('http://192.168.1.115/cryptowallet_api/register', payload);
            console.log(response.data);
            if (response.data.code == 201) {
                await AsyncStorage.setItem('temp_user', JSON.stringify(response.data.user));
                await AsyncStorage.setItem('temp_user_id', response.data.user_id);
                navigation.navigate('SecureWallet');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
    };
    
    const validatePassword = (password) => {
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = (confirmPassword) => {
        if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

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

    const handleLogin = async () => {
        const payload = {
            email: loginEmail,
            password: loginPassword,

        };

        try {
            const response = await axios.post('http://192.168.1.115/cryptowallet_api/login', payload);
             if (response.data.code == 200) {
                const token = 'example-token';
                // console.log(response.data)
                var user = response.data.user
                var user_id = response.data.user_id
                login({ user_id, user });
                // console.debug(user)



            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }

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
                        onPress={() => setShowLoginModal(false)}
                    >
                        <Text style={styles.modalCloseButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.header}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progress, { width: '33%' }]} />
                        </View>
                        <Text style={styles.headerText}>Step 1 of 3</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            This password will unlock your crypto wallet only on this service
                        </Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, emailError && styles.inputError]}
                                placeholder="Account Pin"
                                value={pin}
                                onChangeText={(text) => {
                                    setPin(text);
                                }}
                                maxLength={4}
                                keyboardType="numeric"
                                enterKeyHint='next'
                                autoCapitalize="none"
                                placeholderTextColor="#666"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, emailError && styles.inputError]}
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    validateEmail(text);
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#666"
                            />
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, passwordError && styles.inputError]}
                                placeholder="New password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    validatePassword(text);
                                }}
                                placeholderTextColor="#666"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#666" />
                            </TouchableOpacity>
                            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        </View>

                        {password.length > 0 && (
                            <Text style={[styles.strengthText, { color: passwordStrength === 'Good' ? '#7B61FF' : '#FF6347' }]}>
                                Password strength: {passwordStrength}
                            </Text>
                        )}

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, confirmPasswordError && styles.inputError]}
                                placeholder="Confirm password"
                                secureTextEntry={!showPassword}
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    validateConfirmPassword(text);
                                }}
                                placeholderTextColor="#666"

                            />
                            {confirmPassword && password === confirmPassword && (
                                <View style={styles.checkIcon}>
                                    <Feather name="check" size={24} color="#7B61FF" />
                                </View>
                            )}
                            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                        </View>

                        <Text style={styles.requirement}>Must be at least 8 characters</Text>

                        <View style={styles.faceIdContainer}>
                            <Text style={styles.faceIdText}>Sign in with Face ID?</Text>
                            <Switch
                                value={faceIdEnabled}
                                onValueChange={handleFaceIdToggle}
                                trackColor={{ false: '#767577', true: '#7B61FF' }}
                                thumbColor={faceIdEnabled ? '#fff' : '#f4f3f4'}
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
                            onPress={createaccount}
                        >
                            <Text style={styles.buttonText}>Create Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => setShowLoginModal(true)}
                        >
                            <Text style={styles.loginButtonText}>Already have an account? Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            {renderLoginModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    header: {
        padding: 16,
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 8,
    },
    progress: {
        height: '100%',
        backgroundColor: '#7B61FF',
        borderRadius: 2,
    },
    headerText: {
        color: '#666',
        fontSize: 14,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    subtitle: {
        color: '#666',
        marginBottom: 32,
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#F5F5F5',
    },
    inputError: {
        borderColor: '#FF6347',
    },
    errorText: {
        color: '#FF6347',
        fontSize: 14,
        marginTop: 4,
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
        fontSize: 14,
    },
    requirement: {
        color: '#666',
        marginBottom: 24,
        fontSize: 14,
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
        color: '#7B61FF',
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#7B61FF',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    loginButton: {
        marginTop: 24,
        alignItems: 'center',
        padding: 12,
    },
    loginButtonText: {
        color: '#7B61FF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 32,
        width: '100%',
        paddingBottom: '50%',
        paddingTop: '8%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
    },
    modalButton: {
        backgroundColor: '#7B61FF',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    modalCloseButton: {
        alignItems: 'center',
        padding: 12,
    },
    modalCloseButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});

