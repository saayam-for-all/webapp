'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConflictHandler = void 0;
const utils_1 = require("../../../utils");
const utils_2 = require("../utils");
/**
 * Set a conflict handler that will be used to resolve conflicts that may emerge
 * when matching events with synced messages.
 *
 * @remark
 * The conflict handler is not persisted across app restarts and so must be set again before dispatching an event for
 * any custom handling to take effect.
 *
 * @throws validation: {@link InAppMessagingValidationErrorCode} - Thrown when the provided parameters or library
 * configuration is incorrect, or if In App messaging hasn't been initialized.
 *
 * @param input The input object that holds the conflict handler to be used.
 *
 * @example
 * ```ts
 * // Sync messages before dispatching an event
 * await syncMessages();
 *
 * // Example custom conflict handler
 * const myConflictHandler = (messages) => {
 * 		// Return a random message
 * 		const randomIndex = Math.floor(Math.random() * messages.length);
 * 		return messages[randomIndex];
 *  };
 *
 * // Set the conflict handler
 * setConflictHandler(myConflictHandler);
 *
 * // Dispatch an event
 * await dispatchEvent({ name: 'test_event' });
 * ```
 */
function setConflictHandler(input) {
    (0, utils_1.assertIsInitialized)();
    (0, utils_2.setConflictHandler)(input);
}
exports.setConflictHandler = setConflictHandler;
//# sourceMappingURL=setConflictHandler.js.map
