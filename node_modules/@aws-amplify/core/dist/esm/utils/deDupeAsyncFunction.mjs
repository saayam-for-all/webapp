// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * returns in-flight promise if there is one
 *
 * @param asyncFunction - asyncFunction to be deduped.
 * @returns - the return type of the callback
 */
const deDupeAsyncFunction = (asyncFunction) => {
    let inflightPromise;
    return async (...args) => {
        if (inflightPromise)
            return inflightPromise;
        inflightPromise = new Promise((resolve, reject) => {
            asyncFunction(...args)
                .then(result => {
                resolve(result);
            })
                .catch(error => {
                reject(error);
            })
                .finally(() => {
                inflightPromise = undefined;
            });
        });
        return inflightPromise;
    };
};

export { deDupeAsyncFunction };
//# sourceMappingURL=deDupeAsyncFunction.mjs.map
