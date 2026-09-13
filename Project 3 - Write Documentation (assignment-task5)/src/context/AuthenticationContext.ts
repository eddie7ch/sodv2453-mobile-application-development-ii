import { createContext } from 'react';
import { User } from '../types/User';

/** Shape of the value shared through {@link AuthenticationContext}. */
export type AuthenticationContextObject = {
    /** The user who is currently logged in. */
    value: User;
    /** Saves the logged-in user, or clears it on logout by passing `undefined`. */
    setValue: (newValue: User | undefined) => void;
};

/**
 * Responsibility: shares who is logged in with every screen, without passing it down
 * through each component. The value lives in `AppStack`, is filled in by the Login
 * screen, and is cleared when the user logs out.
 *
 * It's `null` if a component reads it outside the provider.
 */
export const AuthenticationContext = createContext<AuthenticationContextObject | null>(null);
