import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AuthenticationContext } from '../context/AuthenticationContext';
import * as api from '../services/api';
import Login from './Login';

// Test objects: the API, the cache and navigation are mocked, so the screen can be
// tested on its own without json-server running.
jest.mock('../services/api', () => ({ authenticateUser: jest.fn() }));
jest.mock('../services/caching', () => ({
    getFromCache: jest.fn(() => Promise.reject('empty cache')),
    setInCache: jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({ useIsFocused: () => false }));

const authenticateUser = api.authenticateUser as jest.Mock;
const navigation = { navigate: jest.fn() };

const renderLogin = () =>
    render(
        <AuthenticationContext.Provider value={{ value: undefined as any, setValue: jest.fn() }}>
            <Login navigation={navigation as any} route={{} as any} />
        </AuthenticationContext.Provider>
    );

const logIn = async (email: string, password: string) => {
    await fireEvent.changeText(screen.getByTestId('email-input'), email);
    await fireEvent.changeText(screen.getByTestId('password-input'), password);
    await fireEvent.press(screen.getByText('Log in'));
};

beforeEach(() => {
    jest.clearAllMocks();
    authenticateUser.mockResolvedValue({ data: { user: { id: 'abc' }, accessToken: 'token' } });
});

describe('Login screen', () => {
    test.each(['luigi@carluccio.it', 'john@silva.com.br'])(
        'lets %s log in instead of showing "invalid email"',
        async (email) => {
            await renderLogin();
            await logIn(email, '123456');

            expect(screen.queryByText('invalid email')).toBeNull();
            await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('EventsMap'));
            expect(authenticateUser).toHaveBeenCalledWith(email, '123456');
        }
    );

    test('sends the trimmed, lowercased email to the server', async () => {
        await renderLogin();
        await logIn('  Luigi@Carluccio.IT ', '123456');

        await waitFor(() => expect(authenticateUser).toHaveBeenCalledWith('luigi@carluccio.it', '123456'));
    });

    test('shows "invalid email" and does not call the server for a malformed address', async () => {
        await renderLogin();
        await logIn('luigi@carluccio', '123456');

        expect(screen.getByText('invalid email')).toBeTruthy();
        expect(authenticateUser).not.toHaveBeenCalled();
    });

    test('shows "invalid password" and does not call the server for a password under 6 characters', async () => {
        await renderLogin();
        await logIn('luigi@carluccio.it', '123');

        expect(screen.getByText('invalid password')).toBeTruthy();
        expect(authenticateUser).not.toHaveBeenCalled();
    });

    test('stays on the login screen when the server rejects the password', async () => {
        authenticateUser.mockRejectedValue({ response: { data: 'Incorrect password' } });
        await renderLogin();
        await logIn('luigi@carluccio.it', 'wrongpass');

        await waitFor(() => expect(authenticateUser).toHaveBeenCalled());
        expect(navigation.navigate).not.toHaveBeenCalledWith('EventsMap');
    });
});
