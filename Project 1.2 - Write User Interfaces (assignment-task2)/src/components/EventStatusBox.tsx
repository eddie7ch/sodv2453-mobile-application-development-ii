import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EventStatus } from '../utils';

interface EventStatusBoxProps {
    status: EventStatus;
    volunteersApplied: number;
    volunteersNeeded: number;
}

// Colours come straight from the Figma "Event", "Event - Volunteered" and "Event - Full Team" frames
const STATUS_COLORS: Record<EventStatus, { background: string; border: string; text: string }> = {
    open: { background: '#F2E6D9', border: '#FF8700', text: '#FF8700' },
    volunteered: { background: '#E5F6FF', border: '#00A3FF', text: '#00A3FF' },
    full: { background: '#D3E2E5', border: '#8FA7B2', text: '#8FA7B2' },
};

export default function EventStatusBox({ status, volunteersApplied, volunteersNeeded }: EventStatusBoxProps) {
    const colors = STATUS_COLORS[status];

    return (
        <View style={[styles.box, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {status === 'open' ? (
                <Text style={[styles.count, { color: colors.text }]}>
                    {volunteersApplied}
                    <Text style={styles.countOf}> of </Text>
                    {volunteersNeeded}
                </Text>
            ) : (
                <Feather name={status === 'volunteered' ? 'check' : 'slash'} size={48} color={colors.text} />
            )}
            <Text style={[styles.label, { color: colors.text }]}>
                {status === 'open' ? 'Volunteer(s) needed' : status === 'volunteered' ? 'Volunteered' : 'Team is full'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        height: 128,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    count: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 32,
        lineHeight: 36,
    },

    countOf: {
        fontSize: 24,
    },

    label: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 14,
        textAlign: 'center',
    },
});
