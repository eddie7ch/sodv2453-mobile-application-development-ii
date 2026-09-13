import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

interface HeaderProps {
    title: string;
    onBack: () => void;
    onClose?: () => void;
}

export default function Header({ title, onBack, onClose }: HeaderProps) {
    return (
        <View style={styles.container}>
            <BorderlessButton style={styles.side} onPress={onBack}>
                <Feather name="arrow-left" size={24} color="#15B6D6" />
            </BorderlessButton>

            <Text style={styles.title}>{title}</Text>

            {onClose ? (
                <BorderlessButton style={styles.side} onPress={onClose}>
                    <Feather name="x" size={24} color="#FF669D" />
                </BorderlessButton>
            ) : (
                <View style={styles.side} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 112,
        paddingTop: 44,
        paddingHorizontal: 24,
        backgroundColor: '#F9FAFC',
        borderBottomWidth: 1,
        borderColor: '#DDE3F0',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    side: {
        width: 24,
        height: 24,
    },

    title: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8FA7B2',
        fontSize: 15,
    },
});
