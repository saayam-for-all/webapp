import { EndpointResolverOptions } from '@aws-amplify/core/internals/aws-client-utils';
export declare const createCognitoUserPoolEndpointResolver: ({ endpointOverride }: {
    endpointOverride: string | undefined;
}) => (input: EndpointResolverOptions) => {
    url: URL;
};
