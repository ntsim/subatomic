export class RGBAColour {
    /**
     * Generate an RGBA colour from the provided hex colour and an opacity.
     *
     * @param hexColour
     * @param opacity
     * @returns {RGBAColour}
     */
    static fromHex(hexColour: string, opacity: number = 1.0): RGBAColour {
        if (opacity > 1 || opacity < 0) {
            throw new Error('Opacity cannot be greater than 1 or less than 0.');
        }

        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = hexColour.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            throw new Error('Invalid hex colour was provided.');
        }

        return new RGBAColour(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            +opacity,
        );
    }

    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0,
        public a: number = 1
    ) {}

    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
