declare module 'dirty-chai' {}
export default 'dirty-chai';

declare module 'jsdom' {
    export function jsdom(body: string): Element;
}