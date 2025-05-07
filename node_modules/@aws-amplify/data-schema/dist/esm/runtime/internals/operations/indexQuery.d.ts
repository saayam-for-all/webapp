import { AmplifyServer, BaseClient, ClientInternalsGetter, ListArgs, ModelIntrospectionSchema, SchemaModel, QueryArgs } from '../../bridge-types';
export interface IndexMeta {
    queryField: string;
    pk: string;
    sk?: string[];
}
export declare function indexQueryFactory(client: BaseClient, modelIntrospection: ModelIntrospectionSchema, model: SchemaModel, indexMeta: IndexMeta, getInternals: ClientInternalsGetter, context?: boolean): ((contextSpec: AmplifyServer.ContextSpec, args: QueryArgs, options?: ListArgs) => Promise<unknown>) | ((args: QueryArgs, options?: ListArgs) => Promise<unknown>);
