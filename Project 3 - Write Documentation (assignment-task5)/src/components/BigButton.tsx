import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

/** Properties accepted by {@link BigButton}. */
interface BigButtonProps {
    /** Text shown on the button, e.g. "Log in". */
    label: string;
    /** Background colour as a hex string, e.g. "#FF8700". */
    color: string;
    /** Extra styles merged on top of the default button style, e.g. margins. */
    style?: {};
    /** Optional Feather icon shown to the left of the label, e.g. "plus". */
    featherIconName?: keyof typeof Feather.glyphMap;
    /** When true the button is drawn half transparent to look inactive. It doesn't block taps by itself. */
    disabled?: boolean;
    /** Called when the button is tapped. */
    onPress: () => void;
}

/**
 * Large, full-width rounded button used for the app's main actions, like "Log in".
 *
 * Capabilities: shows a label with an optional icon, uses any background colour,
 * fades itself when `disabled` is set, and stretches to fill the width it's given.
 *
 * @param props - See {@link BigButtonProps}.
 * @returns A tappable button element.
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

/**
 * Builds the button's styles from its props, so the colour and faded look can change per button.
 *
 * @param props - The button's `color` and `disabled` props.
 * @returns A StyleSheet with the button, icon and label styles.
 */
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
