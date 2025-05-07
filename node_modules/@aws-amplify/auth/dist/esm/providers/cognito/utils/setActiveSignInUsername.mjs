import '../../../client/utils/store/autoSignInStore.mjs';
import { signInStore } from '../../../client/utils/store/signInStore.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function setActiveSignInUsername(username) {
    const { dispatch } = signInStore;
    dispatch({ type: 'SET_USERNAME', value: username });
}

export { setActiveSignInUsername };
//# sourceMappingURL=setActiveSignInUsername.mjs.map
