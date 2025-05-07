import { DefaultStorage } from './DefaultStorage.mjs';
import { InMemoryStorage } from './InMemoryStorage.mjs';
import { KeyValueStorage } from './KeyValueStorage.mjs';
import { SessionStorage } from './SessionStorage.mjs';
import { SyncSessionStorage } from './SyncSessionStorage.mjs';
export { CookieStorage } from './CookieStorage.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const defaultStorage = new DefaultStorage();
const sessionStorage = new SessionStorage();
const syncSessionStorage = new SyncSessionStorage();
const sharedInMemoryStorage = new KeyValueStorage(new InMemoryStorage());

export { defaultStorage, sessionStorage, sharedInMemoryStorage, syncSessionStorage };
//# sourceMappingURL=index.mjs.map
