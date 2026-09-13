// Lets TypeScript accept `import logo from './logo.png'`. The bundler turns the import into an image source.
declare module '*.png' {
    const value: any;
    export default value;
}
