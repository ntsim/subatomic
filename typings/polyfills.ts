declare module 'raf' {
    export function polyfill(): void;
}

declare module 'object.assign' {
    export function getPolyfill(): void;
}

interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}
