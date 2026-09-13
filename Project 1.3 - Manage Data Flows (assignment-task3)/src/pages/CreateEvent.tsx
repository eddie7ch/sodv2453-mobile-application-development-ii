import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useContext, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import BigButton from '../components/BigButton';
import Spacer from '../components/Spacer';
import { AuthenticationContext } from '../context/AuthenticationContext';
import * as api from '../services/api';
import { uploadImage } from '../services/imageApi';
import { getFromCache } from '../services/caching';
import { castToNumber, formatAMPM } from '../utils';

export default function CreateEvent({ navigation }: StackScreenProps<any>) {
    const authenticationContext = useContext(AuthenticationContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [volunteersNeeded, setVolunteersNeeded] = useState('1');
    const [dateTime, setDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [imageUri, setImageUri] = useState<string>();
    const [imageBase64, setImageBase64] = useState<string>();
    const [position, setPosition] = useState<{ latitude: number; longitude: number }>();
    const [isSaving, setIsSaving] = useState(false);

    // Collect data: read the device's location sensor to place the event on the map.
    const handleUseCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Location permission is required to set where this event happens.');
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    };

    // Collect data: pick an image from the device's photo library.
    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Photo library permission is required to add an event image.');
            return;
        }
        // Drop the previous photo first so two full-size images aren't held in memory at once
        setImageUri(undefined);
        setImageBase64(undefined);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.4,
                base64: true,
            });
            if (!result.canceled && result.assets[0]) {
                setImageUri(result.assets[0].uri);
                setImageBase64(result.assets[0].base64 ?? undefined);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Could not open photo', 'That image could not be loaded. Try a smaller photo or restart the app.');
        }
    };

    // Android has no combined date+time picker, so pick the date first and then the time
    const handleOpenDateTimePicker = () => {
        if (Platform.OS !== 'android') {
            setShowDateTimePicker(true);
            return;
        }
        DateTimePickerAndroid.open({
            value: dateTime,
            mode: 'date',
            onChange: (dateEvent, pickedDate) => {
                if (dateEvent.type !== 'set' || !pickedDate) return;
                DateTimePickerAndroid.open({
                    value: pickedDate,
                    mode: 'time',
                    onChange: (timeEvent, pickedTime) => {
                        setDateTime(timeEvent.type === 'set' && pickedTime ? pickedTime : pickedDate);
                    },
                });
            },
        });
    };

    const formIsValid = (): boolean => {
        if (!name.trim() || !description.trim()) {
            Alert.alert('Missing information', 'Please fill in a name and description.');
            return false;
        }
        if (!position) {
            Alert.alert('Missing location', 'Use "Use current location" to set where this event happens.');
            return false;
        }
        return true;
    };

    // Collect data: send the collected form + sensor data to the internet.
    const handleCreateEvent = async () => {
        if (!formIsValid() || !position) return;

        setIsSaving(true);
        try {
            const accessToken = await getFromCache<string>('accessToken');

            let uploadedImageUrl: string | undefined;
            let imageUploadFailed = false;
            if (imageBase64) {
                try {
                    uploadedImageUrl = await uploadImage(imageBase64);
                } catch (uploadError) {
                    // A broken photo upload (e.g. no ImgBB key) shouldn't stop the event itself from saving
                    console.log(uploadError);
                    imageUploadFailed = true;
                }
            }

            await api.createEvent(
                {
                    name,
                    description,
                    dateTime: dateTime.toISOString(),
                    position,
                    volunteersNeeded: castToNumber(volunteersNeeded) || 1,
                    organizerId: authenticationContext?.value?.id as string,
                    imageUrl: uploadedImageUrl,
                },
                accessToken
            );

            setImageBase64(undefined);
            if (imageUploadFailed) {
                Alert.alert('Event created', "The event was saved, but the photo couldn't be uploaded.");
            }
            navigation.navigate('EventsMap');
        } catch (error) {
            console.log(error);
            Alert.alert('Something went wrong', 'Could not create the event. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <RectButton style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={20} color="#FFF" />
            </RectButton>

            <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 96 }}>
                <Text style={styles.label}>Event name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <Spacer size={16} />
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, { height: 96 }]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Spacer size={16} />
                <Text style={styles.label}>Volunteers needed</Text>
                <TextInput
                    style={styles.input}
                    value={volunteersNeeded}
                    onChangeText={setVolunteersNeeded}
                    keyboardType="number-pad"
                />

                <Spacer size={16} />
                <Text style={styles.label}>Date & time</Text>
                <RectButton style={styles.pickerButton} onPress={handleOpenDateTimePicker}>
                    <Text style={styles.pickerButtonText}>
                        {dateTime.toLocaleDateString()} · {formatAMPM(dateTime)}
                    </Text>
                </RectButton>
                {showDateTimePicker && (
                    <DateTimePicker
                        value={dateTime}
                        mode="datetime"
                        onChange={(_, selectedDate) => {
                            setShowDateTimePicker(false);
                            if (selectedDate) setDateTime(selectedDate);
                        }}
                    />
                )}

                <Spacer size={16} />
                <Text style={styles.label}>Location</Text>
                <RectButton style={styles.pickerButton} onPress={handleUseCurrentLocation}>
                    <Text style={styles.pickerButtonText}>
                        {position
                            ? `${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`
                            : 'Use current location'}
                    </Text>
                </RectButton>

                <Spacer size={16} />
                <Text style={styles.label}>Image</Text>
                <RectButton style={styles.pickerButton} onPress={handlePickImage}>
                    <Text style={styles.pickerButtonText}>{imageUri ? 'Change image' : 'Pick an image'}</Text>
                </RectButton>
                {!!imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

                <Spacer size={40} />
                <BigButton label="Create event" color="#00A3FF" onPress={handleCreateEvent} disabled={isSaving} />
            </ScrollView>

            <Spinner visible={isSaving} textContent="Creating event..." overlayColor="#031A62BF" />
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

    label: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#5C8599',
        fontSize: 15,
        marginBottom: 4,
    },

    input: {
        backgroundColor: '#fff',
        borderWidth: 1.4,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 24,
        color: '#5C8599',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    pickerButton: {
        backgroundColor: '#fff',
        borderWidth: 1.4,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
    },

    pickerButtonText: {
        color: '#5C8599',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    previewImage: {
        width: '100%',
        height: 160,
        borderRadius: 8,
        marginTop: 8,
    },
});
