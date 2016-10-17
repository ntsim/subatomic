interface Subatomic {}
interface SubatomicDOM {}

interface Window {
    subatomic(selector: string, config?: SubatomicConfig.Root): Subatomic;
    subatomicDOM(): SubatomicDOM;
}