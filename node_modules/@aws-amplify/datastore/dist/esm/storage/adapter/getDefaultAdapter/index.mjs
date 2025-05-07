import { isBrowser, isWebWorker } from '@aws-amplify/core/internals/utils';
import IndexedDBAdapter from '../IndexedDBAdapter.mjs';
import AsyncStorageAdapter from '../AsyncStorageAdapter.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getDefaultAdapter = () => {
    if ((isBrowser && window.indexedDB) || (isWebWorker() && self.indexedDB)) {
        return IndexedDBAdapter;
    }
    return AsyncStorageAdapter;
};

export { getDefaultAdapter as default };
//# sourceMappingURL=index.mjs.map
