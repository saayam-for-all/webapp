import { ChangePasswordCommandOutput, ServiceClientFactoryInput } from './types';
export declare const createChangePasswordClient: (config: ServiceClientFactoryInput) => (config: {
    endpointResolver?: (((options: import("@aws-amplify/core/internals/aws-client-utils").EndpointResolverOptions, input?: any) => import("@aws-amplify/core/internals/aws-client-utils").Endpoint) & ((options: import("@aws-amplify/core/internals/aws-client-utils").EndpointResolverOptions) => {
        url: URL;
    })) | undefined;
    service?: string | undefined;
    retryDecider?: (((response?: import("@aws-amplify/core/internals/aws-client-utils").HttpResponse | undefined, error?: unknown, middlewareContext?: import("@aws-amplify/core/internals/aws-client-utils").MiddlewareContext | undefined) => Promise<import("@aws-amplify/core/internals/aws-client-utils").RetryDeciderOutput>) & ((response?: import("@aws-amplify/core/internals/aws-client-utils").HttpResponse | undefined, error?: unknown) => Promise<import("@aws-amplify/core/internals/aws-client-utils").RetryDeciderOutput>)) | undefined;
    computeDelay?: ((attempt: number) => number) | undefined;
    userAgentValue?: string | undefined;
    cache?: "default" | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload" | undefined;
} & {
    [x: string]: unknown;
}, input: import("./types").ChangePasswordRequest) => Promise<ChangePasswordCommandOutput>;
