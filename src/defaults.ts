import ShapeSetting = SubatomicConfig.ShapeSetting;
import MovementSetting = SubatomicConfig.MovementSetting;
import LinkInteractionSetting = SubatomicConfig.LinkInteractionSetting;
import RepulseInteractionSetting = SubatomicConfig.RepulseInteractionSetting;
import BubbleInteractionSetting = SubatomicConfig.BubbleInteractionSetting;
import AttractInteractionSetting = SubatomicConfig.AttractInteractionSetting;

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
    colour: '#ffffff',
    distance: 25,
    opacity: 0.5,
    thickness: 1,
};

export const REPULSE_DEFAULTS: RepulseInteractionSetting = {
    distance: 25,
};

export const BUBBLE_DEFAULTS: BubbleInteractionSetting = {
    distance: 25,
    size: 10,
};

export const ATTRACT_DEFAULTS: AttractInteractionSetting = {
    distance: 25,
};
