import { HttpResponse } from '@aws-amplify/core/internals/aws-client-utils';
export declare const createUserPoolDeserializer: <Output>() => (response: HttpResponse) => Promise<Output>;
