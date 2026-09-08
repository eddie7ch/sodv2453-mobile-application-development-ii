import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import Login from '../pages/Login';
import EventsMap from '../pages/EventsMap';
import EventDetails from '../pages/EventDetails';
import CreateEvent from '../pages/CreateEvent';
import { AuthenticationContext, AuthenticationContextObject } from '../context/AuthenticationContext';
import { User } from '../types/User';

/**
 * The app's single navigation stack and its authentication state.
 *
 * Responsibilities:
 * - Owns `authenticatedUser` and exposes it (plus its setter) to every
 *   screen via `AuthenticationContext`, so any screen can read who's logged
 *   in or log them out without prop-drilling.
 * - Declares the four screens and their order: `Login` (the initial route),
 *   `EventsMap`, `EventDetails`, and `CreateEvent`. Headers are hidden
 *   globally — each screen builds its own back/action buttons instead.
 */
export default function Routes() {
    const [authenticatedUser, setAuthenticatedUser] = useState<User>();

    const authenticationContextObj: AuthenticationContextObject = {
        value: authenticatedUser as User,
        setValue: setAuthenticatedUser,
    };

    return (
        <AuthenticationContext.Provider value={authenticationContextObj}>
            <NavigationContainer>
                <Navigator
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: '#F2F3F5' },
                    }}
                >
                    <Screen name="Login" component={Login} />

                    <Screen name="EventsMap" component={EventsMap} />

                    <Screen name="EventDetails" component={EventDetails} />

                    <Screen name="CreateEvent" component={CreateEvent} />
                </Navigator>
            </NavigationContainer>
        </AuthenticationContext.Provider>
    );
}
