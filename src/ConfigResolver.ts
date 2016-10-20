import * as DEFAULTS from './defaults';
import { deepMerge } from './util';
import ShapeSetting = SubatomicConfig.ShapeSetting;
import MovementSetting = SubatomicConfig.MovementSetting;
import LinkSetting = SubatomicConfig.LinkInteractionSetting;
import OscillatingAnimationSetting = SubatomicConfig.OscillatingAnimationSetting;
import HoverInteractionSetting = SubatomicConfig.HoverInteractionSetting;

const ALLOWED_SHAPES = [
    'circle',
    'square',
    'triangle',
    'polygon',
    'star',
    'image',
];

/**
 * Responsible for validating and ensuring a consistent SubatomicConfig is generated for
 * this instance.
 *
 * Will merge the given configuration object into the defaults to avoid null pointer errors
 * in the rest of the program.
 */
export class ConfigResolver {
    /**
     * @param config
     * @returns {SubatomicConfig.Root}
     */
    static resolve(config: SubatomicConfig.Root): SubatomicConfig.Root {
        return {
            link: handleLink(config.link),
            movement: handleMovement(config.movement),
            onHover: handleOnHover(config.onHover),
            shapes: handleShapes(config.shapes),
        };
    }
}

function handleShapes(shapes: ShapeSetting[]): ShapeSetting[] {
    if (shapes.length < 1) {
        throw new Error('Config must provide at least one shape to render.');
    }

    return shapes.map(handleShape);
}

function handleShape(shape: ShapeSetting): ShapeSetting {
    if (ALLOWED_SHAPES.indexOf(shape.type) < 0) {
        throw new Error('Config must provide a valid non-empty shape.type property.');
    }

    if (shape.opacity < 0 || shape.opacity > 1) {
        throw new Error('Config must provide a shape.opacity.value greater than 0 and less than 1.');
    }

    if (shape.opacityAnimation !== undefined) {
        checkOscillatingAnimationSetting(shape.opacityAnimation, 'shape.opacityAnimation');
    }

    if (shape.sizeAnimation !== undefined) {
        checkOscillatingAnimationSetting(shape.sizeAnimation, 'shape.sizeAnimation');
    }

    return deepMerge(DEFAULTS.SHAPE_DEFAULTS, shape);
}

function checkOscillatingAnimationSetting(animation: OscillatingAnimationSetting, animProp: string): void {
    if (animation.min > animation.max) {
        throw new Error(`Config must provide a ${animProp}.min less than the ${animProp}.max.`);
    }

    if (animation.min < 0) {
        throw new Error(`Config must provide a ${animProp}.min greater than 0.`);
    }
}

function handleMovement(movement: MovementSetting): MovementSetting {
    return deepMerge(DEFAULTS.MOVEMENT_DEFAULTS, movement || {});
}

function handleLink(link: LinkSetting): LinkSetting {
    return deepMerge(DEFAULTS.LINK_DEFAULTS, link || {});
}

function handleOnHover(onHover: HoverInteractionSetting): HoverInteractionSetting {
    if (onHover === undefined) {
        return {};
    }

    if (onHover.repulse && onHover.attract) {
        throw new Error('Config should not set both onHover.repulse and onHover.attract.');
    }

    if (onHover.repulse !== undefined) {
        onHover.repulse = deepMerge(DEFAULTS.REPULSE_DEFAULTS, onHover.repulse);
    }

    if (onHover.bubble !== undefined) {
        onHover.bubble = deepMerge(DEFAULTS.BUBBLE_DEFAULTS, onHover.bubble);
    }

    if (onHover.attract !== undefined) {
        onHover.attract = deepMerge(DEFAULTS.ATTRACT_DEFAULTS, onHover.attract);
    }

    return onHover;
}
