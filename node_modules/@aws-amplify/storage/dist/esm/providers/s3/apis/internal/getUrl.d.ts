import { AmplifyClassV6 } from '@aws-amplify/core';
import { GetUrlInput, GetUrlOutput, GetUrlWithPathOutput } from '../../types';
import { GetUrlInput as GetUrlWithPathInputWithAdvancedOptions } from '../../../../internals';
export declare const getUrl: (amplify: AmplifyClassV6, input: GetUrlInput | GetUrlWithPathInputWithAdvancedOptions) => Promise<GetUrlOutput | GetUrlWithPathOutput>;
