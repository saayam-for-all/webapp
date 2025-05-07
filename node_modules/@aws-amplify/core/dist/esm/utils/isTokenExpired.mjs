// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isTokenExpired({ expiresAt, clockDrift, tolerance = 5000, }) {
    const currentTime = Date.now();
    return currentTime + clockDrift + tolerance > expiresAt;
}

export { isTokenExpired };
//# sourceMappingURL=isTokenExpired.mjs.map
