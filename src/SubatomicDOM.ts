import Subatomic from './Subatomic';

/**
 * The SubatomicDOM acts to provide convenience tracking of all instances of Subatomic on the page.
 */
export default class SubatomicDOM {
    private instances: {
        [id: string]: Subatomic;
    };

    constructor(instances: Subatomic[] = []) {
        this.instances = {};
        instances.forEach(instance => {
            this.instances[instance.id] = instance
        });

        window.addEventListener('resize', this.onResize.bind(this));
    }

    add(instance: Subatomic): SubatomicDOM {
        if (this.instances[instance.id] !== undefined) {
            throw new Error('Attempted to overwrite an existing Subatomic instance.');
        }

        this.instances[instance.id] = instance;

        return this;
    }

    set(id: string, instance: Subatomic): SubatomicDOM {
        this.instances[id] = instance;

        return this;
    }

    get(id: string): Subatomic {
        return this.instances[id];
    }

    remove(id: string): SubatomicDOM {
        delete this.instances[id];

        return this;
    }

    private onResize(e) {
        for (let id in this.instances) {
            if (!this.instances.hasOwnProperty(id)) {
                continue;
            }

            const instance = this.instances[id];
        }
    }
}