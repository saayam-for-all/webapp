import { generateClient as generateClient$1 } from '@aws-amplify/api-graphql/internals';
import { Amplify } from '@aws-amplify/core';

/**
 * Generates an API client that can work with models or raw GraphQL
 *
 * @returns {@link V6Client}
 * @throws {@link Error} - Throws error when client cannot be generated due to configuration issues.
 */
function generateClient(options) {
    return generateClient$1({
        ...(options || {}),
        amplify: Amplify,
    });
}

export { generateClient };
//# sourceMappingURL=API.mjs.map
