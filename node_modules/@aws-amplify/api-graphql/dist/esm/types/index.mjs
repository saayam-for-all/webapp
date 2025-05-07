export { CONTROL_MSG, ConnectionState } from './PubSub.mjs';

var GraphQLAuthError;
(function (GraphQLAuthError) {
    GraphQLAuthError["NO_API_KEY"] = "No api-key configured";
    GraphQLAuthError["NO_CURRENT_USER"] = "No current user";
    GraphQLAuthError["NO_CREDENTIALS"] = "No credentials";
    GraphQLAuthError["NO_FEDERATED_JWT"] = "No federated jwt";
    GraphQLAuthError["NO_AUTH_TOKEN"] = "No auth token specified";
})(GraphQLAuthError || (GraphQLAuthError = {}));
const __amplify = Symbol('amplify');
const __authMode = Symbol('authMode');
const __authToken = Symbol('authToken');
const __apiKey = Symbol('apiKey');
const __headers = Symbol('headers');
const __endpoint = Symbol('endpoint');
function getInternals(client) {
    const c = client;
    return {
        amplify: c[__amplify],
        apiKey: c[__apiKey],
        authMode: c[__authMode],
        authToken: c[__authToken],
        endpoint: c[__endpoint],
        headers: c[__headers],
    };
}

export { GraphQLAuthError, __amplify, __apiKey, __authMode, __authToken, __endpoint, __headers, getInternals };
//# sourceMappingURL=index.mjs.map
