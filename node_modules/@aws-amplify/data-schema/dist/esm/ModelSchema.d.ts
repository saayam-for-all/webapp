import type { DerivedApiDefinition, SetTypeSubArg, SchemaConfiguration, DataSourceConfiguration, DatasourceEngine, UnionToIntersection } from '@aws-amplify/data-schema-types';
import { type InternalModel, SchemaModelType, AddRelationshipFieldsToModelTypeFields, type BaseModelType } from './ModelType';
import type { EnumType } from './EnumType';
import type { CustomType, CustomTypeParamShape } from './CustomType';
import type { CustomOperation, CustomOperationParamShape, InternalCustom, MutationCustomOperation, QueryCustomOperation, SubscriptionCustomOperation } from './CustomOperation';
import { AllowModifier, SchemaAuthorization } from './Authorization';
import { Brand, RenameUsingTuples } from './util';
import { ModelRelationshipField, ModelRelationshipFieldParamShape } from './ModelRelationshipField';
import { ConversationType } from './ai/ConversationType';
export { ModelType } from './ModelType';
export { EnumType } from './EnumType';
export { CustomType } from './CustomType';
export { CustomOperation } from './CustomOperation';
export { ConversationType } from './ai/ConversationType';
export declare const rdsSchemaBrandName = "RDSSchema";
export declare const rdsSchemaBrand: Brand<"RDSSchema">;
export type RDSSchemaBrand = Brand<typeof rdsSchemaBrandName>;
export declare const ddbSchemaBrandName = "DDBSchema";
export type DDBSchemaBrand = Brand<typeof ddbSchemaBrandName>;
type SchemaContent = BaseModelType | CustomType<CustomTypeParamShape> | EnumType | CustomOperation<CustomOperationParamShape, any> | ConversationType;
type AddToSchemaContent = Exclude<SchemaContent, BaseModelType>;
type AddToSchemaContents = Record<string, AddToSchemaContent>;
type NonEmpty<T> = keyof T extends never ? never : T;
export type ModelSchemaContents = Record<string, SchemaContent>;
type InternalSchemaModels = Record<string, InternalModel | EnumType | CustomType<any> | InternalCustom>;
export type ModelSchemaParamShape = {
    types: ModelSchemaContents;
    authorization: SchemaAuthorization<any, any, any>[];
    configuration: SchemaConfiguration<any, any>;
};
export type RDSModelSchemaParamShape = ModelSchemaParamShape;
export type InternalSchema = {
    data: {
        types: InternalSchemaModels;
        authorization: SchemaAuthorization<any, any, any>[];
        configuration: SchemaConfiguration<any, any>;
    };
    context?: {
        schemas: InternalSchema[];
    };
};
export type BaseSchema<T extends ModelSchemaParamShape, IsRDS extends boolean = false> = {
    data: T;
    models: {
        [TypeKey in keyof T['types']]: T['types'][TypeKey] extends BaseModelType ? SchemaModelType<T['types'][TypeKey], TypeKey & string, IsRDS> : never;
    };
    transform: () => DerivedApiDefinition;
    context?: {
        schemas: GenericModelSchema<any>[];
    };
};
export type GenericModelSchema<T extends ModelSchemaParamShape> = BaseSchema<T> & Brand<typeof rdsSchemaBrandName | typeof ddbSchemaBrandName>;
/**
 * Model schema definition interface
 *
 * @param T - The shape of the model schema
 * @param UsedMethods - The method keys already defined
 */
export type ModelSchema<T extends ModelSchemaParamShape, UsedMethods extends 'authorization' | 'relationships' = never> = Omit<{
    authorization: <AuthRules extends SchemaAuthorization<any, any, any>>(callback: (allow: AllowModifier) => AuthRules | AuthRules[]) => ModelSchema<SetTypeSubArg<T, 'authorization', AuthRules[]>, UsedMethods | 'authorization'>;
}, UsedMethods> & BaseSchema<T> & DDBSchemaBrand;
type RDSModelSchemaFunctions = 'addToSchema' | 'addQueries' | 'addMutations' | 'addSubscriptions' | 'authorization' | 'setRelationships' | 'setAuthorization' | 'renameModelFields' | 'renameModels';
type OmitFromEach<Models, Modifier extends string> = {
    [ModelName in keyof Models]: Omit<Models[ModelName], Modifier>;
};
type RelationshipTemplate = Record<string, ModelRelationshipField<ModelRelationshipFieldParamShape, string, any, any>>;
/**
 * RDSModel schema definition interface
 *
 * @param T - The shape of the RDS model schema
 * @param UsedMethods - The method keys already defined
 */
export type RDSModelSchema<T extends RDSModelSchemaParamShape, UsedMethods extends RDSModelSchemaFunctions = never> = Omit<{
    addToSchema: <AddedTypes extends AddToSchemaContents>(types: AddedTypes) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & AddedTypes>, UsedMethods | 'addToSchema'>;
    /**
     * @deprecated use `addToSchema()` to add operations to a SQL schema
     */
    addQueries: <Queries extends Record<string, QueryCustomOperation>>(types: Queries) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & Queries>, UsedMethods | 'addQueries'>;
    /**
     * @deprecated use `addToSchema()` to add operations to a SQL schema
     */
    addMutations: <Mutations extends Record<string, MutationCustomOperation>>(types: Mutations) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & Mutations>, UsedMethods | 'addMutations'>;
    /**
     * @deprecated use `addToSchema()` to add operations to a SQL schema
     */
    addSubscriptions: <Subscriptions extends Record<string, SubscriptionCustomOperation>>(types: Subscriptions) => RDSModelSchema<SetTypeSubArg<T, 'types', T['types'] & Subscriptions>, UsedMethods | 'addSubscriptions'>;
    authorization: <AuthRules extends SchemaAuthorization<any, any, any>>(callback: (allow: AllowModifier) => AuthRules | AuthRules[]) => RDSModelSchema<SetTypeSubArg<T, 'authorization', AuthRules[]>, UsedMethods | 'authorization'>;
    setAuthorization: (callback: (models: OmitFromEach<BaseSchema<T, true>['models'], 'secondaryIndexes'>, schema: RDSModelSchema<T, UsedMethods | 'setAuthorization'>) => void) => RDSModelSchema<T>;
    setRelationships: <Relationships extends ReadonlyArray<Partial<Record<keyof T['types'], RelationshipTemplate>>>>(callback: (models: OmitFromEach<BaseSchema<T, true>['models'], 'authorization' | 'fields' | 'secondaryIndexes'>) => Relationships) => RDSModelSchema<SetTypeSubArg<T, 'types', {
        [ModelName in keyof T['types']]: ModelWithRelationships<T['types'], Relationships, ModelName>;
    }>, UsedMethods | 'setRelationships'>;
    renameModels: <NewName extends string, CurName extends string = keyof BaseSchema<T>['models'] & string, const ChangeLog extends readonly [CurName, NewName][] = []>(callback: () => ChangeLog) => RDSModelSchema<SetTypeSubArg<T, 'types', RenameUsingTuples<T['types'], ChangeLog>>, UsedMethods | 'renameModels'>;
}, UsedMethods> & BaseSchema<T, true> & RDSSchemaBrand;
/**
 * Amplify API Next Model Schema shape
 */
export type ModelSchemaType = ModelSchema<ModelSchemaParamShape>;
type ModelWithRelationships<Types extends Record<string, any>, Relationships extends ReadonlyArray<Record<string, RelationshipTemplate | undefined>>, ModelName extends keyof Types, RelationshipMap extends UnionToIntersection<Relationships[number]> = UnionToIntersection<Relationships[number]>> = ModelName extends keyof RelationshipMap ? RelationshipMap[ModelName] extends Record<string, ModelRelationshipField<ModelRelationshipFieldParamShape, string, any, any>> ? AddRelationshipFieldsToModelTypeFields<Types[ModelName], RelationshipMap[ModelName]> : Types[ModelName] : Types[ModelName];
/**
 * Model Schema type guard
 * @param schema - api-next ModelSchema or string
 * @returns true if the given value is a ModelSchema
 */
export declare const isModelSchema: (schema: string | ModelSchemaType) => schema is ModelSchemaType;
type SchemaReturnType<DE extends DatasourceEngine, Types extends ModelSchemaContents> = DE extends 'dynamodb' ? ModelSchema<{
    types: Types;
    authorization: [];
    configuration: any;
}> : RDSModelSchema<{
    types: Types;
    authorization: [];
    configuration: any;
}>;
/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param types The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export declare const schema: <Types extends ModelSchemaContents>(types: NonEmpty<Types>) => ModelSchema<{
    types: Types;
    authorization: [];
    configuration: any;
}, never>;
/**
 * Configure wraps schema definition with non-default config to allow usecases other than
 * the default DynamoDB use-case.
 *
 * @param config The SchemaConfig augments the schema with content like the database type
 * @returns
 */
export declare function configure<DE extends DatasourceEngine>(config: SchemaConfiguration<DE, DataSourceConfiguration<DE>>): {
    schema: <Types extends ModelSchemaContents>(types: NonEmpty<Types>) => SchemaReturnType<DE, Types>;
};
export declare function isCustomPathData(obj: any): obj is CustomPathData;
export type CustomPathData = {
    stack: string | undefined;
    entry: string;
};
