'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqual = exports.isObject = exports.bothNilOrEqual = exports.isNil = void 0;
const isNil = (value) => {
    return value === undefined || value === null;
};
exports.isNil = isNil;
const bothNilOrEqual = (original, output) => {
    return ((0, exports.isNil)(original) && (0, exports.isNil)(output)) || original === output;
};
exports.bothNilOrEqual = bothNilOrEqual;
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
exports.isObject = isObject;
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
            object.every((val, ix) => (0, exports.isEqual)(val, other[ix])));
    }
    if (!(0, exports.isObject)(object) || !(0, exports.isObject)(other)) {
        return object === other;
    }
    const objectKeys = Object.keys(object);
    const otherKeys = Object.keys(other);
    if (objectKeys.length !== otherKeys.length) {
        return false;
    }
    return objectKeys.every(key => {
        return (otherKeys.includes(key) &&
            (0, exports.isEqual)(object[key], other[key]));
    });
};
exports.isEqual = isEqual;
//# sourceMappingURL=integrityHelpers.js.map
