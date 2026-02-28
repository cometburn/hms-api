const isDate = (value: unknown): value is Date => {
    return value instanceof Date;
};

export const compareObjects = <T extends Record<string, unknown>, K extends keyof T>(
    original: T,
    updated: Partial<T>,
    keys: K[]
): Partial<Pick<T, K>> => {
    const changes: Partial<Pick<T, K>> = {};

    for (const key of keys) {
        if (!(key in updated)) continue;

        const originalValue = original[key];
        const updatedValue = updated[key];

        // Safe Date comparison
        if (isDate(originalValue) && isDate(updatedValue)) {
            if (originalValue.getTime() !== updatedValue.getTime()) {
                changes[key] = updatedValue as T[K];
            }
            continue;
        }

        // Normal strict comparison
        if (originalValue !== updatedValue) {
            changes[key] = updatedValue as T[K];
        }
    }

    return changes;
};
