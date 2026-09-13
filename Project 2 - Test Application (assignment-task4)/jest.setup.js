// Expo SDK 57's "winter" runtime lazily installs a global `fetch` getter
// (expo/src/winter/installGlobal.ts) that, when first read, requires the
// native ExpoFetchModule. That native module isn't available under Jest, and
// jest-expo doesn't ship a mock for it, so anything that touches
// `global.fetch` (including Jest's own module-registry teardown) crashes the
// test run.
//
// installGlobal() only overrides globals it can reconfigure: if a property
// already exists on `global` with `configurable: false`, it logs a warning
// and leaves it alone instead of installing its lazy getter. Node already
// ships a working `fetch` global, so we just need to "lock it in" before
// jest-expo's setup file runs (see jest.config.js, which lists this file
// first in setupFiles).
if (typeof global.fetch === 'function') {
    Object.defineProperty(global, 'fetch', {
        value: global.fetch,
        configurable: false,
        writable: true,
        enumerable: true,
    });
}
