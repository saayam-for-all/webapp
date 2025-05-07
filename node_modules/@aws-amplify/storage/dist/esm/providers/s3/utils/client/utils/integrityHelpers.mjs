// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const isNil = (value) => {
    return value === undefined || value === null;
};
const bothNilOrEqual = (original, output) => {
    return (isNil(original) && isNil(output)) || original === output;
};
/**
 * This function is used to determine if a value is an object.
 * It excludes arrays and null values.
 *
 * @param value
 * @returns
 */
const isObject = (value) => {
    return value != null && typeof value === 'object' && !Array.isArray(value);
};
/**
 * This function is used to compare two objects and determine if they are equal.
 * It handles nested objects and arrays as well.
 * Array order is not taken into account.
 *
 * @param object
 * @param other
 * @returns
 */
const isEqual = (object, other) => {
    if (Array.isArray(object) && !Array.isArray(other)) {
        return false;
    }
    if (!Array.isArray(object) && Array.isArray(other)) {
        return false;
    }
    if (Array.isArray(object) && Array.isArray(other)) {
        return (object.length === other.length &&
            object.every((val, ix) => isEqual(val, other[ix])));
    }
    if (!isObject(object) || !isObject(other)) {
        return object === other;
    }
    const objectKeys = Object.keys(object);
    const otherKeys = Object.keys(other);
    if (objectKeys.length !== otherKeys.length) {
        return false;
    }
    return objectKeys.every(key => {
        return (otherKeys.includes(key) &&
            isEqual(object[key], other[key]));
    });
};

export { bothNilOrEqual, isEqual, isNil, isObject };
//# sourceMappingURL=integrityHelpers.mjs.map
