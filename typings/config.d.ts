declare namespace SubatomicConfig {
    export interface Root {
        shapes: ShapeSetting[];
        opacity?: OpacitySetting;
        size?: SizeSetting;
        movement?: MovementSetting;
        link?: LinkSetting;
    }

    export interface ShapeSetting {
        type: 'circle' |
            'square' |
            'triangle' |
            'polygon' |
            'star' |
            'image';
        number?: number;
        density?: number;
        colour?: string;
        opacity?: OpacitySetting;
        size?: SizeSetting;
    }

    export interface ImageSetting extends ShapeSetting {
        src: string;
        ratioX: number;
        ratioY: number;
    }

    export interface PolygonSetting extends ShapeSetting {
        sides: number;
    }

    export interface OpacitySetting {
        value: number;
        animation?: OpacityAnimationSetting;
    }

    export interface SizeSetting {
        value: number;
        animation?: AnimationSetting;
    }

    export interface OpacityAnimationSetting {
        min: number;
        speed: number;
        allSynced: boolean;
    }

    export interface AnimationSetting {
        speed: number;
    }

    export interface MovementSetting {
        enabled?: boolean,
        direction?:
            'none' |
            'top' |
            'top-right' |
            'right' |
            'bottom-right' |
            'bottom' |
            'bottom-left' |
            'left' |
            'top-left';
        type?: 'random' | 'straight';
        speed?: number;
        bounce?: boolean;
    }

    export interface LinkSetting {
        enabled?: boolean;
        distance?: number;
        colour?: string;
        opacity?: number;
        width?: number;
    }
}
