import { PersonalizeEventsExtensionConfiguration } from "./extensionConfiguration";
export interface RuntimeExtension {
  configure(
    extensionConfiguration: PersonalizeEventsExtensionConfiguration
  ): void;
}
export interface RuntimeExtensionsConfig {
  extensions: RuntimeExtension[];
}
export declare const resolveRuntimeExtensions: (
  runtimeConfig: any,
  extensions: RuntimeExtension[]
) => any;
