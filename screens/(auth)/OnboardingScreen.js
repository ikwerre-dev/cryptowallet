import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/(auth)/onboarding.png')}
                    style={styles.onboardingImage}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Your personal crypto wallet</Text>
                    <Text style={styles.subtitle}>
                        Its secure and support near about hundred crypto currencies
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                    <LinearGradient
                        colors={['#4AFEBA', '#28E0B1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <AntDesign name="arrowright" size={20} color="#000" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    onboardingImage: {
        width: width * 0.9,
        height: width * 0.9,
        resizeMode: 'cover',
        marginBottom: 40,
    },
    textContainer: {
        width: '100%',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 16,
        color: '#AAAAAA',
        textAlign: 'left',
        lineHeight: 24,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginRight: 8,
    },
});