import { SHAPE_DEFAULTS, MOVEMENT_DEFAULTS } from './defaults';
import { deepMerge } from './util';
import ShapeSetting = SubatomicConfig.ShapeSetting;
import SizeSetting = SubatomicConfig.SizeSetting;
import MovementSetting = SubatomicConfig.MovementSetting;

const ALLOWED_SHAPES = [
    'circle',
    'square',
    'triangle',
    'polygon',
    'star',
    'image'
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
            shapes: handleShapes(config.shapes),
            movement: handleMovement(config.movement),
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

    if (shape.opacity !== undefined && typeof shape.opacity !== 'object') {
        throw new Error('Config must provide an object for the shape.opacity property.');
    }

    if (shape.size !== undefined && typeof shape.size !== 'object') {
        throw new Error('Config must provide an object for the shape.size property.');
    }

    return deepMerge(SHAPE_DEFAULTS, shape);
}

function handleMovement(movement: MovementSetting): MovementSetting {
    return deepMerge(MOVEMENT_DEFAULTS, movement || {});
}