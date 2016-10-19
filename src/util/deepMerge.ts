export function deepMerge<X, Y>(target: X, source: Y): X & Y {
    let result = <X & Y> Object.assign({}, target);

    Object.keys(source)
        .forEach((prop) => {
            const value = (<any> source)[prop];

            // If an array, we want to iterate through and perform deepMerge
            // recursively on any elements that are also objects
            if (Array.isArray(value)) {
                // Map with by either adding the primitive element
                // or running another recursive deepMerge
                (<any> result)[prop] = value.map((val) => {
                    if (typeof val !== 'object') {
                        return val;
                    }

                    return deepMerge({}, val);
                });

                return;
            }

            if (typeof value !== 'object') {
                (<any> result)[prop] = value;

                return;
            }

            (<any> result)[prop] = deepMerge((<any> result)[prop], value);
        });

    return result;
}
