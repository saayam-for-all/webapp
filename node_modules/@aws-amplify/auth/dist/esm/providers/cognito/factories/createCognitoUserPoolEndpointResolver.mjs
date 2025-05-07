import { AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { cognitoUserPoolEndpointResolver } from '../../../foundation/cognitoUserPoolEndpointResolver.mjs';

const createCognitoUserPoolEndpointResolver = ({ endpointOverride }) => (input) => {
    if (endpointOverride) {
        return { url: new AmplifyUrl(endpointOverride) };
    }
    return cognitoUserPoolEndpointResolver(input);
};

export { createCognitoUserPoolEndpointResolver };
//# sourceMappingURL=createCognitoUserPoolEndpointResolver.mjs.map
