import ShapeSetting = SubatomicConfig.ShapeSetting;
import MovementSetting = SubatomicConfig.MovementSetting;
import LinkSetting = SubatomicConfig.LinkSetting;

export const SHAPE_DEFAULTS: ShapeSetting = {
    type: 'circle',
    number: 20,
    opacity: {
        value: 1,
    },
    size: {
        value: 3,
    },
    colour: '#ffffff',
};

export const MOVEMENT_DEFAULTS: MovementSetting = {
    enabled: true,
    type: 'random',
    speed: 0.01,
    direction: 'none',
    bounce: true
};

export const LINK_DEFAULTS: LinkSetting = {
    enabled: true,
};