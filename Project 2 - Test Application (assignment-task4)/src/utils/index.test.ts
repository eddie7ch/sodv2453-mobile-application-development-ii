import { sanitizeEmail, validateEmail } from './index';

// Bug report (QA, Ray): some users can't log in because the app says "invalid email"
// for real addresses. Reported for Luigi (luigi@carluccio.it) and John (john@silva.com.br).
// These tests reproduce it first, then cover the other address shapes the same bug affects.

describe('validateEmail: addresses from the bug report', () => {
    test('accepts Luigi, whose address ends in a 2-letter country code (.it)', () => {
        expect(validateEmail('luigi@carluccio.it')).toBe(true);
    });

    test('accepts John, whose address ends in .com.br', () => {
        expect(validateEmail('john@silva.com.br')).toBe(true);
    });
});

describe('validateEmail: every seeded user can log in', () => {
    const seededEmails = [
        'ulla.ulriksen@example.com',
        'yasemin.akyuz@example.com',
        'luigi@carluccio.it',
        'john@silva.com.br',
        'elif.aksit@example.com',
        'anne.vanwingerden@example.com',
        'gisele.oliveira@example.com',
        'sara.barnett@example.com',
        'azuma.gamez@example.com',
        'eva.young@example.com',
    ];

    test.each(seededEmails)('accepts %s', (email) => {
        expect(validateEmail(email)).toBe(true);
    });
});

describe('validateEmail: other real addresses the old regex rejected', () => {
    test.each([
        ['a 2-letter ending', 'a@b.co'],
        ['a Canadian address', 'user_name@domain.ca'],
        ['a 4-letter ending', 'x@my-site.info'],
        ['a long ending', 'curator@example.museum'],
        ['a subdomain', 'first.last@mail.example.org'],
        ['a + in the name', 'bob+news@gmail.com'],
        ['an apostrophe in the name', "o'brien@example.ie"],
        ['uppercase letters', 'JOHN@Silva.COM.BR'],
        ['spaces around the address', '  luigi@carluccio.it  '],
    ])('accepts %s: %s', (_, email) => {
        expect(validateEmail(email)).toBe(true);
    });
});

describe('validateEmail: still rejects addresses that are actually invalid', () => {
    test.each([
        ['empty string', ''],
        ['no @', 'luigi.carluccio.it'],
        ['nothing after @', 'luigi@'],
        ['nothing before @', '@carluccio.it'],
        ['no domain ending', 'luigi@carluccio'],
        ['1-letter ending', 'luigi@carluccio.i'],
        ['two @ signs', 'luigi@@carluccio.it'],
        ['space inside', 'luigi carluccio@example.it'],
        ['double dot', 'luigi..c@example.it'],
        ['starts with a dot', '.luigi@carluccio.it'],
        ['double dot in domain', 'luigi@carluccio..it'],
    ])('rejects %s: %s', (_, email) => {
        expect(validateEmail(email)).toBe(false);
    });
});

describe('sanitizeEmail', () => {
    test('trims spaces and lowercases, so the server gets the same address that was validated', () => {
        expect(sanitizeEmail('  John@Silva.COM.BR ')).toBe('john@silva.com.br');
    });
});
