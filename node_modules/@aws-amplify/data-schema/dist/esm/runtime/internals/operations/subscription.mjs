import { map } from 'rxjs';
import { generateGraphQLDocument, buildGraphQLVariables, authModeParams, getCustomHeaders, flattenItems, initializeModel } from '../APIClient.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function subscriptionFactory(client, modelIntrospection, model, operation, getInternals) {
    const { name } = model;
    const subscription = (args) => {
        const query = generateGraphQLDocument(modelIntrospection, model, operation, args);
        const variables = buildGraphQLVariables(model, operation, args, modelIntrospection);
        const auth = authModeParams(client, getInternals, args);
        const headers = getCustomHeaders(client, getInternals, args?.headers);
        const observable = client.graphql({
            ...auth,
            query,
            variables,
        }, headers);
        return observable.pipe(map((value) => {
            const [key] = Object.keys(value.data);
            const data = value.data[key];
            const flattenedResult = flattenItems(modelIntrospection, name, data);
            if (flattenedResult === null) {
                return null;
            }
            else if (args?.selectionSet) {
                return flattenedResult;
            }
            else {
                const [initialized] = initializeModel(client, name, [flattenedResult], modelIntrospection, auth.authMode, auth.authToken);
                return initialized;
            }
        }));
    };
    return subscription;
}

export { subscriptionFactory };
//# sourceMappingURL=subscription.mjs.map
