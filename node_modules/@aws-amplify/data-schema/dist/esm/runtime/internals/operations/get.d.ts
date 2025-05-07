import { AmplifyServer, BaseClient, ClientInternalsGetter, GraphQLOptions, ModelIntrospectionSchema, SchemaModel, CustomUserAgentDetails } from '../../bridge-types';
import { ModelOperation } from '../APIClient';
export declare function getFactory(client: BaseClient, modelIntrospection: ModelIntrospectionSchema, model: SchemaModel, operation: ModelOperation, getInternals: ClientInternalsGetter, useContext?: boolean, customUserAgentDetails?: CustomUserAgentDetails): (contextSpec: AmplifyServer.ContextSpec & GraphQLOptions, arg?: any, options?: any) => Promise<unknown>;
