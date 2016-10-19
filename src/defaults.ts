import ShapeSetting = SubatomicConfig.ShapeSetting;
import MovementSetting = SubatomicConfig.MovementSetting;
import LinkSetting = SubatomicConfig.LinkSetting;

export const SHAPE_DEFAULTS: ShapeSetting = {
    colour: '#ffffff',
    number: 20,
    opacity: {
        animation: {
            min: 0.1,
            speed: 1,
            synced: false,
        },
        value: 1,
    },
    size: {
        value: 3,
    },
    type: 'circle',
};

export const MOVEMENT_DEFAULTS: MovementSetting = {
    bounce: true,
    direction: 'none',
    enabled: true,
    speed: 0.01,
    type: 'random',
};

export const LINK_DEFAULTS: LinkSetting = {
    enabled: true,
};
