export declare const DEFAULT_SERVICE_CLIENT_API_CONFIG: {
    service: string;
    retryDecider: (response?: import("@aws-amplify/core/internals/aws-client-utils").HttpResponse | undefined, error?: unknown) => Promise<import("@aws-amplify/core/internals/aws-client-utils").RetryDeciderOutput>;
    computeDelay: (attempt: number) => number;
    userAgentValue: string;
    cache: string;
};
