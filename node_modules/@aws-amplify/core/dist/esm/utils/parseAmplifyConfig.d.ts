import { ResourcesConfig } from '../index';
import { AmplifyOutputsUnknown } from '../singleton/AmplifyOutputs/types';
import { LegacyConfig } from '../singleton/types';
/**
 * Parses the variety of configuration shapes that Amplify can accept into a ResourcesConfig.
 *
 * @param amplifyConfig An Amplify configuration object conforming to one of the supported schemas.
 * @return A ResourcesConfig for the provided configuration object.
 */
export declare const parseAmplifyConfig: (amplifyConfig: ResourcesConfig | LegacyConfig | AmplifyOutputsUnknown) => ResourcesConfig;
