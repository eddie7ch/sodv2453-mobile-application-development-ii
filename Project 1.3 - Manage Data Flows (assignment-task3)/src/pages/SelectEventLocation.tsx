import { StackScreenProps } from '@react-navigation/stack';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker } from 'react-native-maps';
import customMapStyle from '../../map-style.json';
import BigButton from '../components/BigButton';
import Header from '../components/Header';
import * as MapSettings from '../constants/MapSettings';
import mapMarkerImg from '../images/map-marker.png';

// Step 1 of creating an event: tap the map to choose where it happens
export default function SelectEventLocation({ navigation }: StackScreenProps<any>) {
    const mapViewRef = useRef<MapView>(null);
    const [position, setPosition] = useState<LatLng>();

    // Start the map where the user is (reads the GPS sensor), so their area is easy to pick from
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;
                const { coords } = await Location.getCurrentPositionAsync({});
                mapViewRef.current?.animateToRegion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    ...MapSettings.DEFAULT_DELTA,
                });
            } catch (error) {
                // Without a location the map just stays on the default region
                console.log(error);
            }
        })();
    }, []);

    const handleMapPress = (event: MapPressEvent) => {
        setPosition(event.nativeEvent.coordinate);
    };

    const handleNext = () => {
        if (position) navigation.navigate('CreateEvent', { position });
    };

    return (
        <View style={styles.container}>
            <Header
                title="Add event"
                onBack={() => navigation.goBack()}
                onClose={() => navigation.navigate('EventsMap')}
            />

            <MapView
                ref={mapViewRef}
                style={styles.map}
                initialRegion={MapSettings.DEFAULT_REGION}
                customMapStyle={customMapStyle}
                rotateEnabled={false}
                toolbarEnabled={false}
                onPress={handleMapPress}
            >
                {position && (
                    <Marker coordinate={position}>
                        <Image resizeMode="contain" style={styles.marker} source={mapMarkerImg} />
                    </Marker>
                )}
            </MapView>

            {position && (
                <View style={styles.footer}>
                    <BigButton label="Next" color="#00A3FF" onPress={handleNext} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    map: {
        flex: 1,
    },

    marker: {
        width: 48,
        height: 54,
    },

    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,
        flexDirection: 'row',
    },
});
