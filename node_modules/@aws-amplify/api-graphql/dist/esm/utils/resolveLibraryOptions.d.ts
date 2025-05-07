import { AmplifyClassV6 } from '@aws-amplify/core';
/**
 * @internal
 */
export declare const resolveLibraryOptions: (amplify: AmplifyClassV6) => {
    headers: ((options?: {
        /**
         * @internal
         */
        query?: string | undefined;
        variables?: Record<string, import("@aws-amplify/core/internals/utils").DocumentType> | undefined;
    } | undefined) => Promise<Record<string, unknown> | import("@aws-amplify/core/internals/aws-client-utils").Headers>) | undefined;
    withCredentials: boolean | undefined;
};
