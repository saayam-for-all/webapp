import { AWSAppSyncRealTimeProviderOptions } from '../AWSAppSyncRealTimeProvider';
export declare const isCustomDomain: (url: string) => boolean;
export declare const getRealtimeEndpointUrl: (appSyncGraphqlEndpoint: string | undefined) => URL;
/**
 *
 * @param headers - http headers
 * @returns uri-encoded query parameters derived from custom headers
 */
export declare const queryParamsFromCustomHeaders: (headers?: AWSAppSyncRealTimeProviderOptions['additionalCustomHeaders']) => URLSearchParams;
/**
 * Normalizes AppSync realtime endpoint URL
 *
 * @param appSyncGraphqlEndpoint - AppSync endpointUri from config
 * @param urlParams - URLSearchParams
 * @returns fully resolved string realtime endpoint URL
 */
export declare const realtimeUrlWithQueryString: (appSyncGraphqlEndpoint: string | undefined, urlParams: URLSearchParams) => string;
export declare const additionalHeadersFromOptions: (options: AWSAppSyncRealTimeProviderOptions) => Promise<{
    additionalCustomHeaders: {};
    libraryConfigHeaders: {};
}>;
