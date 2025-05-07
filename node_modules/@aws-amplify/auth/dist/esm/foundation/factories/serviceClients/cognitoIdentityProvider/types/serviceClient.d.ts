import { EndpointResolverOptions } from '@aws-amplify/core/internals/aws-client-utils';
export interface ServiceClientFactoryInput {
    endpointResolver(options: EndpointResolverOptions): {
        url: URL;
    };
}
