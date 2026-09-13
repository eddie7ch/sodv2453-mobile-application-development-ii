import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { formatBytes } from '../utils';

export interface UploadedPicture {
    uri: string;
    fileName: string;
    fileSize: number;
    url: string;
}

interface PictureFieldProps {
    picture?: UploadedPicture;
    isUploading: boolean;
    onPick: () => void;
    onRemove: () => void;
}

// Empty dashed box with "+" until a picture is uploaded, then its thumbnail, name and size
export default function PictureField({ picture, isUploading, onPick, onRemove }: PictureFieldProps) {
    if (isUploading) {
        return (
            <View style={[styles.box, styles.emptyBox]}>
                <ActivityIndicator color="#00A3FF" />
                <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
        );
    }

    if (!picture) {
        return (
            <RectButton style={[styles.box, styles.emptyBox]} onPress={onPick}>
                <Feather name="plus" size={24} color="#8FA7B2" />
            </RectButton>
        );
    }

    return (
        <View style={[styles.box, styles.filledBox]}>
            <Image source={{ uri: picture.uri }} style={styles.thumbnail} />
            <View style={styles.details}>
                <Text style={styles.fileName} numberOfLines={1}>
                    {picture.fileName}
                </Text>
                <Text style={styles.fileSize}>{formatBytes(picture.fileSize, 0)}</Text>
            </View>
            <BorderlessButton onPress={onRemove}>
                <Feather name="x" size={24} color="#FF669D" />
            </BorderlessButton>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        height: 72,
        borderRadius: 8,
        borderWidth: 1.4,
    },

    emptyBox: {
        borderStyle: 'dashed',
        borderColor: '#96D2F0',
        backgroundColor: '#F5FAFE',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    filledBox: {
        borderColor: '#96D2F0',
        backgroundColor: '#E5F6FF',
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },

    uploadingText: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8FA7B2',
        marginLeft: 8,
    },

    thumbnail: {
        width: 56,
        height: 56,
        borderRadius: 4,
    },

    details: {
        flex: 1,
        marginHorizontal: 12,
    },

    fileName: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#5C8599',
        fontSize: 14,
    },

    fileSize: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#8FA7B2',
        fontSize: 12,
    },
});
