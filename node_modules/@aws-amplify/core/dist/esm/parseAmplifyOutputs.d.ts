import { AmplifyOutputsAnalyticsProperties, AmplifyOutputsUnknown } from './singleton/AmplifyOutputs/types';
import { AnalyticsConfig, LegacyConfig, ResourcesConfig } from './singleton/types';
export declare function isAmplifyOutputs(config: ResourcesConfig | LegacyConfig | AmplifyOutputsUnknown): config is AmplifyOutputsUnknown;
export declare function parseAnalytics(amplifyOutputsAnalyticsProperties?: AmplifyOutputsAnalyticsProperties): AnalyticsConfig | undefined;
export declare function parseAmplifyOutputs(amplifyOutputs: AmplifyOutputsUnknown): ResourcesConfig;
