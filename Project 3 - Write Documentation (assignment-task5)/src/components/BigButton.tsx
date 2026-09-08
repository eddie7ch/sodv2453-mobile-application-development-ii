import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

/**
 * Props for {@link BigButton}.
 */
interface BigButtonProps {
    /** Text shown on the button. */
    label: string;
    /** Background color (also used, at reduced opacity, when `disabled`). */
    color: string;
    /** Extra style(s) merged onto the button's own layout styles. */
    style?: {};
    /** Optional Feather icon shown to the left of the label. */
    featherIconName?: keyof typeof Feather.glyphMap;
    /** When true, dims the button (via `color` + alpha) and is expected to be
     * paired with the caller also ignoring/guarding the `onPress` handler. */
    disabled?: boolean;
    /** Called when the button is pressed. */
    onPress: () => void;
}

/**
 * The app's primary call-to-action button — a solid-color, full-width
 * rectangle with a label and an optional leading icon. Used for things like
 * "Log in", "Create event", and "I want to volunteer".
 */
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
