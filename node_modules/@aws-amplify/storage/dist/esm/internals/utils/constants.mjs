// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_CRED_TTL = 15 * 60; // 15 minutes
const MAX_PAGE_SIZE = 1000;
// eslint-disable-next-line no-template-curly-in-string
const ENTITY_IDENTITY_URL = '${cognito-identity.amazonaws.com:sub}';

export { DEFAULT_CRED_TTL, ENTITY_IDENTITY_URL, MAX_PAGE_SIZE };
//# sourceMappingURL=constants.mjs.map
