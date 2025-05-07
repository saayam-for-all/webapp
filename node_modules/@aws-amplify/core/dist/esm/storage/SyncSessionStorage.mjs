import { SyncKeyValueStorage } from './SyncKeyValueStorage.mjs';
import { getSessionStorageWithFallback } from './utils.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
class SyncSessionStorage extends SyncKeyValueStorage {
    constructor() {
        super(getSessionStorageWithFallback());
    }
}

export { SyncSessionStorage };
//# sourceMappingURL=SyncSessionStorage.mjs.map
