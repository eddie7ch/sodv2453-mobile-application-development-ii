import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface BigButtonProps {
    label: string;
    color: string;
    style?: {};
    featherIconName?: keyof typeof Feather.glyphMap; // optional icon to the left of the label
    disabled?: boolean; // dims the button, doesn't disable the press by itself, caller still has to guard onPress
    onPress: () => void;
}

// the app's main call-to-action button, used for Log In, Create Event,
// the volunteer button, etc.
export default function BigButton(props: BigButtonProps) {
    const styles = styling(props);
    const { featherIconName, label, style, onPress } = props;

    return (
        <RectButton style={[styles.button, style]} onPress={onPress}>
            {featherIconName && <Feather style={styles.icon} name={featherIconName} size={24} color="#FFF" />}
            <Text style={styles.label}>{label}</Text>
        </RectButton>
    );
}

const styling = ({ color, disabled }: BigButtonProps) =>
    StyleSheet.create({
        button: {
            paddingVertical: 14,
            paddingHorizontal: 32,
            backgroundColor: disabled ? color + '80' : color,
            borderRadius: 16,
            maxHeight: 56,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },

        icon: {
            marginRight: 8,
        },

        label: {
            fontFamily: 'Nunito_800ExtraBold',
            color: '#FFF',
            fontSize: 15,
        },
    });
