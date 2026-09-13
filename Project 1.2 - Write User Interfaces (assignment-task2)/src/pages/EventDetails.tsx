import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import customMapStyle from '../../map-style.json';
import BigButton from '../components/BigButton';
import EventStatusBox from '../components/EventStatusBox';
import Spacer from '../components/Spacer';
import { AuthenticationContext } from '../context/AuthenticationContext';
import mapMarkerImg from '../images/map-marker.png';
import * as api from '../services/api';
import { getFromCache } from '../services/caching';
import { Event } from '../types/Event';
import { User } from '../types/User';
import { formatAMPM, getEventStatus, getMapsUrl } from '../utils';

export default function EventDetails({ route, navigation }: StackScreenProps<any>) {
    const routeEvent = (route.params as { event: Event }).event;
    const authenticationContext = useContext(AuthenticationContext);
    const userId = authenticationContext?.value?.id;

    const [event, setEvent] = useState<Event>(routeEvent);
    const [organizer, setOrganizer] = useState<User>();
    const [isApplying, setIsApplying] = useState(false);

    // Re-fetch instead of trusting the route params, in case someone else volunteered meanwhile
    useEffect(() => {
        getFromCache<string>('accessToken')
            .then(async (accessToken) => {
                const eventResponse = await api.getEventDetails(routeEvent.id, accessToken);
                setEvent(eventResponse.data);
                const organizerResponse = await api.getUser(eventResponse.data.organizerId, accessToken);
                setOrganizer(organizerResponse.data);
            })
            .catch((error: any) => console.log(error));
    }, [routeEvent.id]);

    const status = getEventStatus(event.volunteersIds, event.volunteersNeeded, userId);
    const organizerPhone = organizer?.mobile.replace(/[^\d+]/g, '');
    const eventDate = new Date(event.dateTime);
    const dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeLabel = formatAMPM(eventDate).toUpperCase();

    const handleCall = () => {
        if (organizerPhone) Linking.openURL(`tel:${organizerPhone}`);
    };

    const handleText = () => {
        if (organizerPhone) Linking.openURL(`sms:${organizerPhone}`);
    };

    const handleShare = () => {
        Share.share({
            message: `${event.name}, ${dateLabel} at ${timeLabel}. Volunteers needed, come help out!\n\n${event.description}`,
        });
    };

    const handleGetDirections = () => {
        Linking.openURL(getMapsUrl(event.position));
    };

    const handleVolunteer = async () => {
        if (!userId) return;
        setIsApplying(true);
        try {
            const accessToken = await getFromCache<string>('accessToken');
            const response = await api.applyToVolunteer(event.id, [...event.volunteersIds, userId], accessToken);
            setEvent(response.data);
        } catch (error) {
            console.log(error);
            Alert.alert('Something went wrong', 'Could not sign you up. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <RectButton style={styles.headerSide} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#15B6D6" />
                </RectButton>
                <Text style={styles.headerTitle}>Event</Text>
                <View style={styles.headerSide} />
            </View>

            <ScrollView>
                {!!event.imageUrl && (
                    <Image source={{ uri: event.imageUrl }} style={styles.eventImage} resizeMode="cover" />
                )}

                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{event.name}</Text>
                    {!!organizer && (
                        <Text style={styles.organizer}>
                            organized by {organizer.name.first} {organizer.name.last}
                        </Text>
                    )}
                    <Text style={styles.description}>{event.description}</Text>

                    <View style={[styles.row, styles.buttonRow]}>
                        <View style={styles.dateBox}>
                            <Feather name="calendar" size={48} color="#00A3FF" />
                            <Text style={styles.dateText}>{dateLabel}</Text>
                            <Text style={styles.dateText}>{timeLabel}</Text>
                        </View>
                        <Spacer size={8} horizontal />
                        <EventStatusBox
                            status={status}
                            volunteersApplied={event.volunteersIds.length}
                            volunteersNeeded={event.volunteersNeeded}
                        />
                    </View>

                    {status === 'open' && (
                        <View style={[styles.row, styles.buttonRow]}>
                            <BigButton label="Share" color="#00A3FF" featherIconName="share-2" onPress={handleShare} />
                            <Spacer size={8} horizontal />
                            <BigButton
                                label="Volunteer"
                                color="#FF8700"
                                featherIconName="plus"
                                disabled={isApplying}
                                onPress={handleVolunteer}
                            />
                        </View>
                    )}

                    {status === 'volunteered' && (
                        <View style={[styles.row, styles.buttonRow]}>
                            <BigButton
                                label="Share"
                                color="#00A3FF"
                                featherIconName="share-2"
                                onPress={handleShare}
                            />
                            <Spacer size={8} horizontal />
                            <BigButton
                                label="Call"
                                color="#00A3FF"
                                featherIconName="phone"
                                onPress={handleCall}
                            />
                            <Spacer size={8} horizontal />
                            <BigButton
                                label="Text"
                                color="#00A3FF"
                                featherIconName="message-circle"
                                onPress={handleText}
                            />
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            customMapStyle={customMapStyle}
                            initialRegion={{ ...event.position, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
                            zoomEnabled={false}
                            pitchEnabled={false}
                            scrollEnabled={false}
                            rotateEnabled={false}
                            toolbarEnabled={false}
                        >
                            <Marker coordinate={event.position}>
                                <Image resizeMode="contain" style={{ width: 48, height: 54 }} source={mapMarkerImg} />
                            </Marker>
                        </MapView>
                    </View>

                    <View style={[styles.row, styles.buttonRow]}>
                        <BigButton
                            label="Get Directions to Event"
                            color="#4D6F80"
                            featherIconName="map-pin"
                            onPress={handleGetDirections}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBF2F5',
    },

    header: {
        height: 112,
        paddingTop: 44,
        paddingHorizontal: 24,
        backgroundColor: '#F9FAFC',
        borderBottomWidth: 1,
        borderColor: '#DDE3F0',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerSide: {
        width: 24,
        height: 24,
    },

    headerTitle: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8FA7B2',
        fontSize: 15,
    },

    eventImage: {
        width: '100%',
        height: 210,
    },

    detailsContainer: {
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    title: {
        fontFamily: 'Nunito_800ExtraBold',
        color: '#5C8599',
        fontSize: 24,
        lineHeight: 28,
    },

    organizer: {
        fontFamily: 'Nunito_400Regular',
        color: '#5C8599',
        fontSize: 14,
        marginTop: 4,
    },

    description: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#5C8599',
        fontSize: 16,
        lineHeight: 22,
        marginTop: 16,
    },

    row: {
        flexDirection: 'row',
    },

    buttonRow: {
        marginTop: 24,
    },

    dateBox: {
        flex: 1,
        height: 128,
        backgroundColor: '#E5F6FF',
        borderWidth: 1,
        borderColor: '#00A3FF',
        borderRadius: 8,
        padding: 16,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    dateText: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#00A3FF',
        fontSize: 14,
        textAlign: 'center',
    },

    divider: {
        height: 1,
        backgroundColor: '#D3E2E5',
        marginVertical: 24,
    },

    mapContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#D3E2E5',
    },

    map: {
        width: '100%',
        height: 327,
    },
});
