import { AmplifyClassV6 } from '@aws-amplify/core';
import { RemoveInput, RemoveOutput, RemoveWithPathOutput } from '../../types';
import { RemoveInput as RemoveWithPathInputWithAdvancedOptions } from '../../../../internals';
export declare const remove: (amplify: AmplifyClassV6, input: RemoveInput | RemoveWithPathInputWithAdvancedOptions) => Promise<RemoveOutput | RemoveWithPathOutput>;
