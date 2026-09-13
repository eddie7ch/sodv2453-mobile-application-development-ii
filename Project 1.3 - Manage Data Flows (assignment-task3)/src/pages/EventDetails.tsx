import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import BigButton from '../components/BigButton';
import Spacer from '../components/Spacer';
import { AuthenticationContext } from '../context/AuthenticationContext';
import * as api from '../services/api';
import { getFromCache } from '../services/caching';
import { Event } from '../types/Event';
import { formatAMPM } from '../utils';

export default function EventDetails({ route, navigation }: StackScreenProps<any>) {
    const routeEvent = (route.params as { event: Event }).event;
    const authenticationContext = useContext(AuthenticationContext);
    const userId = authenticationContext?.value?.id as string | undefined;
    const [event, setEvent] = useState<Event>(routeEvent);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        getFromCache<string>('accessToken')
            .then((accessToken) => api.getEventDetails(routeEvent.id, accessToken))
            .then((response) => setEvent(response.data))
            .catch((error: any) => console.log(error));
    }, [routeEvent.id]);

    const volunteersNeeded = event.volunteersNeeded - event.volunteersIds.length;
    const isEventFull = volunteersNeeded <= 0;
    const hasApplied = !!userId && event.volunteersIds.includes(userId);

    const handleApplyToVolunteer = async () => {
        if (!userId || hasApplied || isEventFull) return;

        setIsApplying(true);
        try {
            const accessToken = await getFromCache<string>('accessToken');
            const response = await api.applyToVolunteer(event.id, [...event.volunteersIds, userId], accessToken);
            setEvent(response.data);
            Alert.alert("You're in", 'Thanks for volunteering for this event.');
        } catch (error) {
            console.log(error);
            Alert.alert('Something went wrong', 'Could not sign you up. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <View style={styles.container}>
            <RectButton style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={20} color="#FFF" />
            </RectButton>

            <ScrollView>
                {!!event.imageUrl && (
                    <Image source={{ uri: event.imageUrl }} style={styles.eventImage} resizeMode="cover" />
                )}

                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{event.name}</Text>
                    <Text style={styles.dateTime}>
                        {new Date(event.dateTime).toLocaleDateString()} · {formatAMPM(new Date(event.dateTime))}
                    </Text>

                    <Spacer size={24} />
                    <Text style={styles.description}>{event.description}</Text>

                    <Spacer size={24} />
                    <Text style={styles.volunteersLabel}>
                        {hasApplied
                            ? "You're volunteering for this event"
                            : isEventFull
                            ? 'This event no longer needs volunteers'
                            : `${volunteersNeeded} volunteer(s) needed`}
                    </Text>

                    <Spacer size={40} />
                    <BigButton
                        label={hasApplied ? 'Already volunteering' : 'I want to volunteer'}
                        color="#00A3FF"
                        disabled={isEventFull || hasApplied || isApplying}
                        onPress={handleApplyToVolunteer}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F3F5',
    },

    backButton: {
        position: 'absolute',
        top: 44,
        left: 24,
        zIndex: 1,

        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#4D6F80',

        justifyContent: 'center',
        alignItems: 'center',

        elevation: 3,
    },

    eventImage: {
        width: '100%',
        height: 240,
    },

    detailsContainer: {
        padding: 24,
    },

    title: {
        fontFamily: 'Nunito_800ExtraBold',
        color: '#081633',
        fontSize: 24,
    },

    dateTime: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8fa7b3',
        fontSize: 15,
        marginTop: 4,
    },

    description: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#6B7A8F',
        fontSize: 15,
        lineHeight: 24,
    },

    volunteersLabel: {
        fontFamily: 'Nunito_700Bold',
        color: '#37C77F',
        fontSize: 15,
    },
});
