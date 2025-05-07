import { HttpResponse } from '@aws-amplify/core/internals/aws-client-utils';
export declare const createEmptyResponseDeserializer: <Output>() => (response: HttpResponse) => Promise<Output | undefined>;
