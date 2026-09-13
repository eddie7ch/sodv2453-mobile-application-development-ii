const jestExpoPreset = require('jest-expo/jest-preset');

module.exports = {
    ...jestExpoPreset,
    // Our own setup file has to run before jest-expo's setup.js (which
    // installs Expo's global polyfills), so it goes first in the list.
    setupFiles: [require.resolve('./jest.setup.js'), ...(jestExpoPreset.setupFiles || [])],
};
