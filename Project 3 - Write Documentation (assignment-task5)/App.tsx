import React from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import {
    useFonts,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import AppStack from './src/routes/AppStack';
import { StatusBar } from 'expo-status-bar';

/**
 * Root component of the app.
 *
 * Loads the Nunito fonts the whole app uses, and shows nothing until they're ready so
 * text never flashes in the wrong font. Once loaded it renders the status bar, the
 * action sheet provider (for pop-up option menus) and the navigation stack.
 *
 * @returns The app's navigation tree, or `null` while fonts are still loading.
 */
export default function App() {
    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    if (!fontsLoaded) {
        return null;
    } else {
        return (
            <>
                <StatusBar animated style="dark" />
                <ActionSheetProvider>
                    <AppStack />
                </ActionSheetProvider>
            </>
        );
    }
}
