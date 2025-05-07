import { AmplifyClassV6 } from '@aws-amplify/core';
import { CopyInput, CopyOutput, CopyWithPathOutput } from '../../types';
import { CopyInput as CopyWithPathInputWithAdvancedOptions } from '../../../../internals';
export declare const copy: (amplify: AmplifyClassV6, input: CopyInput | CopyWithPathInputWithAdvancedOptions) => Promise<CopyOutput | CopyWithPathOutput>;
/** @deprecated Use {@link copyWithPath} instead. */
export declare const copyWithKey: (amplify: AmplifyClassV6, input: CopyInput) => Promise<CopyOutput>;
