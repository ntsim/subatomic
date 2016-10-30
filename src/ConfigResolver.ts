import * as DEFAULTS from './defaults';
import { deepMerge } from './util';
import ShapeSetting = SubatomicConfig.ShapeSetting;
import MovementSetting = SubatomicConfig.MovementSetting;
import LinkSetting = SubatomicConfig.LinkInteractionSetting;
import OscillatingAnimationSetting = SubatomicConfig.OscillatingAnimationSetting;
import HoverInteractionSetting = SubatomicConfig.HoverInteractionSetting;
import ClickInteractionSetting = SubatomicConfig.ClickInteractionSetting;

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
        const resolvedConfig: SubatomicConfig.Root = {
            onClick: handleOnClick(config.onClick),
            onHover: handleOnHover(config.onHover),
            shapes: handleShapes(config.shapes),
        };

        if (config.movement !== undefined) {
            resolvedConfig.movement = deepMerge(DEFAULTS.MOVEMENT_DEFAULTS, config.movement);
        }

        if (config.link !== undefined) {
            resolvedConfig.link = deepMerge(DEFAULTS.LINK_DEFAULTS, config.link);
        }

        return resolvedConfig;
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

    if (onHover.link !== undefined) {
        onHover.link = deepMerge(DEFAULTS.LINK_DEFAULTS, onHover.link);
    }

    return onHover;
}

function handleOnClick(onClick: ClickInteractionSetting): ClickInteractionSetting {
    if (onClick === undefined ) {
        return {};
    }

    if (onClick.create !== undefined) {
        onClick.create = deepMerge(DEFAULTS.CREATE_DEFAULTS, onClick.create);
    }

    return onClick;
}
