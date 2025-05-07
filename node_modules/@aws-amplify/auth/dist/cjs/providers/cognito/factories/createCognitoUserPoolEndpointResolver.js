'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.createCognitoUserPoolEndpointResolver = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const cognitoUserPoolEndpointResolver_1 = require("../../../foundation/cognitoUserPoolEndpointResolver");
const createCognitoUserPoolEndpointResolver = ({ endpointOverride }) => (input) => {
    if (endpointOverride) {
        return { url: new utils_1.AmplifyUrl(endpointOverride) };
    }
    return (0, cognitoUserPoolEndpointResolver_1.cognitoUserPoolEndpointResolver)(input);
};
exports.createCognitoUserPoolEndpointResolver = createCognitoUserPoolEndpointResolver;
//# sourceMappingURL=createCognitoUserPoolEndpointResolver.js.map
