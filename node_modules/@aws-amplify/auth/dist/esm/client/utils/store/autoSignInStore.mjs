// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function defaultState() {
    return {
        active: false,
    };
}
const autoSignInReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERNAME':
            return {
                ...state,
                username: action.value,
            };
        case 'SET_SESSION':
            return {
                ...state,
                session: action.value,
            };
        case 'START':
            return {
                ...state,
                active: true,
            };
        case 'RESET':
            return defaultState();
        default:
            return state;
    }
};
const createAutoSignInStore = (reducer) => {
    let currentState = reducer(defaultState(), { type: 'RESET' });
    return {
        getState: () => currentState,
        dispatch: action => {
            currentState = reducer(currentState, action);
        },
    };
};
const autoSignInStore = createAutoSignInStore(autoSignInReducer);

export { autoSignInStore };
//# sourceMappingURL=autoSignInStore.mjs.map
