import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Checkbox({ checked, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={[styles.checkbox, checked && styles.checked]}>
                {checked && <Feather name="check" size={16} color="#fff" />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#000',
    },
});