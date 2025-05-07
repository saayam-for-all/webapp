'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTITY_IDENTITY_URL = exports.MAX_PAGE_SIZE = exports.DEFAULT_CRED_TTL = void 0;
exports.DEFAULT_CRED_TTL = 15 * 60; // 15 minutes
exports.MAX_PAGE_SIZE = 1000;
// eslint-disable-next-line no-template-curly-in-string
exports.ENTITY_IDENTITY_URL = '${cognito-identity.amazonaws.com:sub}';
//# sourceMappingURL=constants.js.map
