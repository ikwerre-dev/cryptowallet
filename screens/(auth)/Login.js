import { useAuth } from '../../context/AuthContext';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const token = 'example-token'; // Replace with a token from your backend
        login({ email, token });
    };

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="Submit" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});