import { AmplifyClass } from '../../../singleton';
import { LibraryOptions, ResourcesConfig } from '../../../singleton/types';
export declare namespace AmplifyServer {
    interface ContextToken {
        readonly value: symbol;
    }
    interface ContextSpec {
        readonly token: ContextToken;
    }
    interface Context {
        amplify: AmplifyClass;
    }
    type RunOperationWithContext = <Result>(amplifyConfig: ResourcesConfig, libraryOptions: LibraryOptions, operation: (contextSpec: AmplifyServer.ContextSpec) => Result | Promise<Result>) => Promise<Result>;
}
