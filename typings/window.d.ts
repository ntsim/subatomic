interface SubatomicDOM {}

interface Window {
    subatomic(selector: string, config?: SubatomicConfig.Root): SubatomicDOM;
}