import { BaseBrowserClient, ClientInternalsGetter, ModelIntrospectionSchema, SchemaModel } from '../../bridge-types';
import { ModelOperation } from '../APIClient';
export declare function subscriptionFactory(client: BaseBrowserClient, modelIntrospection: ModelIntrospectionSchema, model: SchemaModel, operation: ModelOperation, getInternals: ClientInternalsGetter): (args?: Record<string, any>) => import("rxjs").Observable<any>;
