declare namespace SubatomicConfig {
    export interface Root {
        shapes: ShapeSetting[];
        movement?: MovementSetting;
        link?: LinkInteractionSetting;
        onHover?: HoverInteractionSetting;
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
        opacity?: number;
        opacityAnimation?: OscillatingAnimationSetting;
        size?: number;
        sizeAnimation?: OscillatingAnimationSetting;
    }

    export interface ImageSetting extends ShapeSetting {
        src: string;
        ratioX: number;
        ratioY: number;
    }

    export interface PolygonSetting extends ShapeSetting {
        sides: number;
    }

    export interface OscillatingAnimationSetting {
        max: number;
        min: number;
        speed: number;
        synced: boolean;
    }

    export interface MovementSetting {
        enabled?: boolean;
        direction?: 'none' |
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

    export interface LinkInteractionSetting {
        distance?: number;
        colour?: string;
        opacity?: number;
        thickness?: number;
    }

    export interface BubbleInteractionSetting {
        distance?: number;
        size?: number;
    }

    export interface RepulseInteractionSetting {
        distance?: number;
    }

    export interface AttractInteractionSetting {
        distance?: number;
    }

    export interface HoverInteractionSetting {
        link?: LinkInteractionSetting;
        bubble?: BubbleInteractionSetting;
        repulse?: RepulseInteractionSetting;
        attract?: AttractInteractionSetting;
    }
}
