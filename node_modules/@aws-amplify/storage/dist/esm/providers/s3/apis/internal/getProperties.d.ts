import { AmplifyClassV6 } from '@aws-amplify/core';
import { StorageAction } from '@aws-amplify/core/internals/utils';
import { GetPropertiesInput, GetPropertiesOutput, GetPropertiesWithPathOutput } from '../../types';
import { GetPropertiesInput as GetPropertiesWithPathInputWithAdvancedOptions } from '../../../../internals';
export declare const getProperties: (amplify: AmplifyClassV6, input: GetPropertiesInput | GetPropertiesWithPathInputWithAdvancedOptions, action?: StorageAction) => Promise<GetPropertiesOutput | GetPropertiesWithPathOutput>;
