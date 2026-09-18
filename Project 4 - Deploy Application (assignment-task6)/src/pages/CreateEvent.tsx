import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { LatLng } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import BigButton from '../components/BigButton';
import Header from '../components/Header';
import PictureField, { UploadedPicture } from '../components/PictureField';
import { AuthenticationContext } from '../context/AuthenticationContext';
import * as api from '../services/api';
import { getFromCache } from '../services/caching';
import { uploadImage } from '../services/imageApi';
import { formatAMPM } from '../utils';

const ABOUT_MAX_LENGTH = 300;

// Step 2 of creating an event: the details form. The location comes from step 1.
export default function CreateEvent({ navigation, route }: StackScreenProps<any>) {
    const { position } = route.params as { position: LatLng };
    const authenticationContext = useContext(AuthenticationContext);

    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [volunteersNeeded, setVolunteersNeeded] = useState('');
    const [dateTime, setDateTime] = useState<Date>();
    const [showIosPicker, setShowIosPicker] = useState(false);
    const [picture, setPicture] = useState<UploadedPicture>();
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const volunteersCount = Number(volunteersNeeded);
    const dateIsInFuture = !!dateTime && dateTime.getTime() > Date.now();

    // Every field is mandatory, so Save stays disabled until all of them are filled in
    const formIsComplete =
        name.trim().length > 0 &&
        about.trim().length > 0 &&
        Number.isInteger(volunteersCount) &&
        volunteersCount > 0 &&
        dateIsInFuture &&
        !!picture;

    // Android has no combined date+time picker, so ask for the date first and then the time
    const handleOpenDateTimePicker = () => {
        if (Platform.OS !== 'android') {
            setShowIosPicker(true);
            return;
        }
        DateTimePickerAndroid.open({
            value: dateTime ?? new Date(),
            mode: 'date',
            minimumDate: new Date(),
            onValueChange: (_, pickedDate) => {
                DateTimePickerAndroid.open({
                    value: pickedDate,
                    mode: 'time',
                    onValueChange: (__, pickedTime) => setDateTime(pickedTime),
                });
            },
        });
    };

    const pickFrom = async (source: 'camera' | 'library') => {
        // Check the device permission for whichever source the user chose
        const permission =
            source === 'camera'
                ? await ImagePicker.requestCameraPermissionsAsync()
                : await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                'Permission needed',
                source === 'camera'
                    ? 'Allow camera access to take a picture for this event.'
                    : 'Allow photo library access to choose a picture for this event.'
            );
            return;
        }

        const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.4, base64: true };
        let result: ImagePicker.ImagePickerResult;
        try {
            result =
                source === 'camera'
                    ? await ImagePicker.launchCameraAsync(options)
                    : await ImagePicker.launchImageLibraryAsync(options);
        } catch (error) {
            console.log(error);
            Alert.alert('Could not open picture', 'Try again, or pick a smaller photo.');
            return;
        }

        const asset = result.canceled ? undefined : result.assets[0];
        if (!asset?.base64) return;

        // Upload straight away, so the thumbnail and file details only show once it's actually online
        setIsUploading(true);
        try {
            const url = await uploadImage(asset.base64);
            setPicture({
                uri: asset.uri,
                url,
                fileName: asset.fileName ?? asset.uri.split('/').pop() ?? 'image.jpg',
                fileSize: asset.fileSize ?? Math.round(asset.base64.length * 0.75),
            });
        } catch (error) {
            console.log(error);
            Alert.alert('Upload failed', 'The picture could not be uploaded. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePickPicture = () => {
        Alert.alert('Add a picture', undefined, [
            { text: 'Take photo', onPress: () => pickFrom('camera') },
            { text: 'Choose from library', onPress: () => pickFrom('library') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const handleSave = async () => {
        if (!formIsComplete || !dateTime || !picture) return;

        setIsSaving(true);
        try {
            const accessToken = await getFromCache<string>('accessToken');
            await api.createEvent(
                {
                    name: name.trim(),
                    description: about.trim(),
                    dateTime: dateTime.toISOString(),
                    position,
                    volunteersNeeded: volunteersCount,
                    organizerId: authenticationContext?.value?.id as string,
                    imageUrl: picture.url,
                },
                accessToken
            );
            // The map reloads events whenever it comes back into focus, so the new one shows up there
            navigation.navigate('EventsMap');
        } catch (error) {
            console.log(error);
            Alert.alert('Something went wrong', 'Could not save the event. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const dateOnlyLabel = dateTime
        ? dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '';
    const timeOnlyLabel = dateTime ? formatAMPM(dateTime).toUpperCase() : '';

    return (
        <View style={styles.container}>
            <Header
                title="Add event"
                onBack={() => navigation.goBack()}
                onClose={() => navigation.navigate('EventsMap')}
            />

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Event Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>About</Text>
                    <Text style={styles.hint}>{ABOUT_MAX_LENGTH} characters max.</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.multiline]}
                    value={about}
                    onChangeText={setAbout}
                    maxLength={ABOUT_MAX_LENGTH}
                    multiline
                    textAlignVertical="top"
                />

                <Text style={styles.label}>Volunteers Needed</Text>
                <TextInput
                    style={styles.input}
                    value={volunteersNeeded}
                    onChangeText={(text) => setVolunteersNeeded(text.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                />

                <Text style={styles.label}>Date and Time</Text>
                <View style={styles.dateTimeRow}>
                    <RectButton
                        style={[styles.input, styles.dateInput, styles.dateTimeBox]}
                        onPress={handleOpenDateTimePicker}
                    >
                        <Text style={styles.inputText}>{dateOnlyLabel}</Text>
                    </RectButton>
                    <RectButton
                        style={[styles.input, styles.dateInput, styles.dateTimeBox]}
                        onPress={handleOpenDateTimePicker}
                    >
                        <Text style={styles.inputText}>{timeOnlyLabel}</Text>
                    </RectButton>
                </View>
                {!!dateTime && !dateIsInFuture && <Text style={styles.error}>Pick a date and time in the future.</Text>}
                {showIosPicker && (
                    <DateTimePicker
                        value={dateTime ?? new Date()}
                        mode="datetime"
                        minimumDate={new Date()}
                        onValueChange={(_, selected) => {
                            setShowIosPicker(false);
                            if (selected) setDateTime(selected);
                        }}
                        onDismiss={() => setShowIosPicker(false)}
                    />
                )}

                <Text style={styles.label}>Picture</Text>
                <PictureField
                    picture={picture}
                    isUploading={isUploading}
                    onPick={handlePickPicture}
                    onRemove={() => setPicture(undefined)}
                />

                <View style={styles.saveRow}>
                    <BigButton
                        label="Save"
                        color="#00A3FF"
                        disabled={!formIsComplete || isUploading || isSaving}
                        onPress={handleSave}
                    />
                </View>
            </ScrollView>

            <Spinner visible={isSaving} textContent="Saving event..." overlayColor="#031A62BF" textStyle={styles.spinnerText} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBF2F5',
    },

    form: {
        padding: 24,
        paddingBottom: 48,
    },

    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },

    label: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8FA7B2',
        fontSize: 15,
        marginTop: 16,
        marginBottom: 8,
    },

    hint: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8FA7B2',
        fontSize: 12,
    },

    input: {
        backgroundColor: '#FFF',
        borderWidth: 1.4,
        borderColor: '#D3E2E5',
        borderRadius: 8,
        height: 56,
        paddingHorizontal: 24,
        color: '#5C8599',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    multiline: {
        height: 111,
        paddingTop: 16,
    },

    dateInput: {
        justifyContent: 'center',
    },

    dateTimeRow: {
        flexDirection: 'row',
        gap: 8,
    },

    dateTimeBox: {
        flex: 1,
    },

    inputText: {
        color: '#5C8599',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
    },

    error: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#FF669D',
        fontSize: 12,
        marginTop: 4,
    },

    saveRow: {
        flexDirection: 'row',
        marginTop: 32,
    },

    spinnerText: {
        color: '#FFF',
    },
});
