import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'volunteam-2-test',
    slug: 'volunteam-2-test',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
    },
    android: {
        package: 'com.eddie7ch.volunteam2test',
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
            },
        },
    },
    web: {
        favicon: './assets/favicon.png',
    },
    plugins: [
        [
            'expo-image-picker',
            {
                photosPermission: 'The app accesses your photos to let you add them to events.',
                cameraPermission: 'The app accesses your camera to let you add pictures to events.',
            },
        ],
        '@react-native-community/datetimepicker',
        'expo-font',
        'expo-status-bar',
        [
            'expo-splash-screen',
            {
                image: './assets/splash.png',
                resizeMode: 'cover',
                backgroundColor: '#031A62',
            },
        ],
    ],
    extra: {
        eas: {
            projectId: '37e1c2b1-f1d1-4b45-b78d-5b32e66b1cf2',
        },
        IMGBB_API_KEY: process.env.IMGBB_API_KEY,
    },
});
