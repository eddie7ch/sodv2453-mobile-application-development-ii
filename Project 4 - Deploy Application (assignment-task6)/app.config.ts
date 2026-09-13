import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'volunteam',
    slug: 'volunteam-4-deploy',
    version: '1.2.2',
    orientation: 'portrait',
    icon: './assets/icon.png',
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.eddie7ch.volunteam4deploy',
    },
    android: {
        package: 'com.eddie7ch.volunteam4deploy',
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
        // The app talks to json-server over plain http on the local network, which Android
        // release builds block unless it's allowed here.
        ['expo-build-properties', { android: { usesCleartextTraffic: true } }],
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
});
