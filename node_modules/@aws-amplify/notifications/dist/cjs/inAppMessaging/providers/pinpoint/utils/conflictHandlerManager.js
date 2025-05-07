'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConflictHandler = exports.setConflictHandler = void 0;
/**
 * The default conflict handler. Can be overridden by `setConflictHandler`.
 */
let conflictHandler = (messages) => {
    // default behavior is to return the message closest to expiry
    // this function assumes that messages processed by providers already filters out expired messages
    const sorted = messages.sort((a, b) => {
        const endDateA = a.metadata?.endDate;
        const endDateB = b.metadata?.endDate;
        // if both message end dates are falsy or have the same date string, treat them as equal
        if (endDateA === endDateB) {
            return 0;
        }
        // if only message A has an end date, treat it as closer to expiry
        if (endDateA && !endDateB) {
            return -1;
        }
        // if only message B has an end date, treat it as closer to expiry
        if (!endDateA && endDateB) {
            return 1;
        }
        // otherwise, compare them
        return new Date(endDateA) < new Date(endDateB) ? -1 : 1;
    });
    // always return the top sorted
    return sorted[0];
};
/**
 * Sets conflict handler.
 *
 * @internal
 */
const setConflictHandler = (input) => {
    conflictHandler = input;
};
exports.setConflictHandler = setConflictHandler;
/**
 * Returns the current conflict handler.
 *
 * @internal
 */
const getConflictHandler = () => conflictHandler;
exports.getConflictHandler = getConflictHandler;
//# sourceMappingURL=conflictHandlerManager.js.map
