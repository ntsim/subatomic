import ShapeSetting = SubatomicConfig.ShapeSetting;
import MovementSetting = SubatomicConfig.MovementSetting;
import LinkInteractionSetting = SubatomicConfig.LinkInteractionSetting;
import RepulseInteractionSetting = SubatomicConfig.RepulseInteractionSetting;

export const SHAPE_DEFAULTS: ShapeSetting = {
    colour: '#ffffff',
    number: 20,
    opacity: 1,
    size: 3,
    type: 'circle',
};

export const MOVEMENT_DEFAULTS: MovementSetting = {
    bounce: true,
    direction: 'none',
    enabled: true,
    speed: 0.01,
    type: 'random',
};

export const LINK_DEFAULTS: LinkInteractionSetting = {
};

export const REPULSE_DEFAULTS: RepulseInteractionSetting = {
    distance: 40,
};
