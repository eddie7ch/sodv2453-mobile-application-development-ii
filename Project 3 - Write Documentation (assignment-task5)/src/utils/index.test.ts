import { validateEmail } from './index';

describe('validateEmail', () => {
    // Bug report (QA, Ray): some users can't log in. Entering their email
    // returns "invalid email" even though the address is a real one.
    // Reproduced with two of the seeded users from db.json: Luigi
    // (luigi@carluccio.it) and John (john@silva.com.br). Root cause: the
    // regex required the domain's final segment to be exactly 3 characters
    // (`\.\w{3}` with no upper bound), which rejects any 2-letter country-code
    // TLD such as `.it` or `.br`.
    test('accepts addresses with a 2-letter country-code TLD (bug: Luigi could not log in)', () => {
        expect(validateEmail('luigi@carluccio.it')).toBe(true);
    });

    test('accepts addresses with a multi-label domain ending in a 2-letter TLD (bug: John could not log in)', () => {
        expect(validateEmail('john@silva.com.br')).toBe(true);
    });

    test('still accepts a standard 3-letter TLD address', () => {
        expect(validateEmail('ulla.ulriksen@example.com')).toBe(true);
    });

    test('still rejects addresses with no domain', () => {
        expect(validateEmail('missing@tld')).toBe(false);
    });

    test('still rejects addresses with no @', () => {
        expect(validateEmail('not-an-email')).toBe(false);
    });

    test('still rejects an empty string', () => {
        expect(validateEmail('')).toBe(false);
    });
});
