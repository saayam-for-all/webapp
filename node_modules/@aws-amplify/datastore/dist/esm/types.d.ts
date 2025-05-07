import { InternalAPI } from '@aws-amplify/api/internals';
import { GraphQLAuthMode } from '@aws-amplify/core/internals/utils';
import { ModelInstanceCreator } from './datastore/datastore';
import { NAMESPACES } from './util';
import { PredicateAll } from './predicates';
import { Adapter } from './storage/adapter';
export type Scalar<T> = T extends (infer InnerType)[] ? InnerType : T;
/**
 * @deprecated If you intended to use the Schema for `generateClient`, then you've imported the wrong Schema type.
 * Use `import { type Schema } from '../amplify/data/resource' instead. If you intended to import the type for DataStore
 * Schemas, then import "DataStoreSchema" instead.
 */
export type Schema = DataStoreSchema;
export type DataStoreSchema = UserSchema & {
    version: string;
    codegenVersion: string;
};
export interface UserSchema {
    models: SchemaModels;
    nonModels?: SchemaNonModels;
    relationships?: RelationshipType;
    keys?: ModelKeys;
    enums: SchemaEnums;
    modelTopologicalOrdering?: Map<string, string[]>;
}
export interface InternalSchema {
    namespaces: SchemaNamespaces;
    version: string;
    codegenVersion: string;
}
export type SchemaNamespaces = Record<string, SchemaNamespace>;
export type SchemaNamespace = UserSchema & {
    name: string;
};
export type SchemaModels = Record<string, SchemaModel>;
export interface SchemaModel {
    name: string;
    pluralName: string;
    attributes?: ModelAttributes;
    /**
     * Explicitly defined fields.
     */
    fields: ModelFields;
    /**
     * Explicitly defined fields plus implied fields. (E.g., foreign keys.)
     */
    allFields?: ModelFields;
    syncable?: boolean;
}
/**
 * @private
 * @param obj
 * @returns `true` if the given object likely represents a model in a schema.
 */
export declare function isSchemaModel(obj: any): obj is SchemaModel;
/**
 * @private
 * @param m
 * @returns `true` if the given schema entry defines Schema Model attributes.
 */
export declare function isSchemaModelWithAttributes(m: SchemaModel | SchemaNonModel): m is SchemaModel;
export type SchemaNonModels = Record<string, SchemaNonModel>;
export interface SchemaNonModel {
    name: string;
    fields: ModelFields;
}
type SchemaEnums = Record<string, SchemaEnum>;
interface SchemaEnum {
    name: string;
    values: string[];
}
export interface ModelMeta<T extends PersistentModel> {
    builder: PersistentModelConstructor<T>;
    schema: SchemaModel;
    pkField: string[];
}
export type ModelAssociation = AssociatedWith | TargetNameAssociation;
interface AssociatedWith {
    connectionType: 'HAS_MANY' | 'HAS_ONE';
    associatedWith: string | string[];
    targetName?: string;
    targetNames?: string[];
}
/**
 * @private
 * @param obj
 * @returns `true` if the object is an `AssociatedWith` definition.
 */
export declare function isAssociatedWith(obj: any): obj is AssociatedWith;
interface TargetNameAssociation {
    connectionType: 'BELONGS_TO';
    targetName?: string;
    targetNames?: string[];
}
/**
 * @private
 * @param obj
 * @returns `true` if the given object specifies either `targetName` or `targetNames`.
 */
export declare function isTargetNameAssociation(obj: any): obj is TargetNameAssociation;
interface FieldAssociation {
    connectionType: 'HAS_ONE' | 'BELONGS_TO' | 'HAS_MANY';
}
/**
 * @private
 * @param obj
 * @param fieldName
 * @returns Truthy if the object has a `FieldAssociation` for the given `fieldName`.
 */
export declare function isFieldAssociation(obj: any, fieldName: string): obj is FieldAssociation;
export type ModelAttributes = ModelAttribute[];
export interface ModelAttribute {
    type: string;
    properties?: Record<string, any>;
}
export interface ModelAuthRule {
    allow: string;
    provider?: string;
    operations?: string[];
    ownerField?: string;
    identityClaim?: string;
    groups?: string[];
    groupClaim?: string;
    groupsField?: string;
}
export interface ModelAttributeAuth {
    type: 'auth';
    properties: {
        rules: ModelAuthRule[];
    };
}
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute is an auth attribute with rules.
 */
export declare function isModelAttributeAuth(attr: ModelAttribute): attr is ModelAttributeAuth;
interface ModelAttributeKey {
    type: 'key';
    properties: {
        name?: string;
        fields: string[];
    };
}
interface ModelAttributePrimaryKey {
    type: 'key';
    properties: {
        name: never;
        fields: string[];
    };
}
interface ModelAttributeCompositeKey {
    type: 'key';
    properties: {
        name: string;
        fields: [string, string, string, string?, string?];
    };
}
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute is a key field.
 */
export declare function isModelAttributeKey(attr: ModelAttribute): attr is ModelAttributeKey;
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute is a primary key, indicated by the key being unnamed.
 */
export declare function isModelAttributePrimaryKey(attr: ModelAttribute): attr is ModelAttributePrimaryKey;
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute represents a composite key with multiple fields.
 */
export declare function isModelAttributeCompositeKey(attr: ModelAttribute): attr is ModelAttributeCompositeKey;
export interface ModelAttributeAuthProperty {
    allow: ModelAttributeAuthAllow;
    identityClaim?: string;
    groupClaim?: string;
    groups?: string[];
    operations?: string[];
    ownerField?: string;
    provider?: ModelAttributeAuthProvider;
}
export declare enum ModelAttributeAuthAllow {
    CUSTOM = "custom",
    OWNER = "owner",
    GROUPS = "groups",
    PRIVATE = "private",
    PUBLIC = "public"
}
export declare enum ModelAttributeAuthProvider {
    FUNCTION = "function",
    USER_POOLS = "userPools",
    OIDC = "oidc",
    IAM = "iam",
    API_KEY = "apiKey"
}
export type ModelFields = Record<string, ModelField>;
export declare enum GraphQLScalarType {
    ID = 0,
    String = 1,
    Int = 2,
    Float = 3,
    Boolean = 4,
    AWSDate = 5,
    AWSTime = 6,
    AWSDateTime = 7,
    AWSTimestamp = 8,
    AWSEmail = 9,
    AWSJSON = 10,
    AWSURL = 11,
    AWSPhone = 12,
    AWSIPAddress = 13
}
export declare namespace GraphQLScalarType {
    function getJSType(scalar: keyof Omit<typeof GraphQLScalarType, 'getJSType' | 'getValidationFunction'>): "string" | "number" | "boolean" | "object";
    function getValidationFunction(scalar: keyof Omit<typeof GraphQLScalarType, 'getJSType' | 'getValidationFunction'>): ((val: string) => boolean) | ((val: number) => boolean) | undefined;
}
export interface AuthorizationRule {
    identityClaim: string;
    ownerField: string;
    provider: 'userPools' | 'oidc' | 'iam' | 'apiKey';
    groupClaim: string;
    groups: [string];
    groupsField: string;
    authStrategy: 'owner' | 'groups' | 'private' | 'public';
    areSubscriptionsPublic: boolean;
}
/**
 * @private
 * @returns `true` if the given field specifies a scalar type.
 */
export declare function isGraphQLScalarType(obj: any): obj is keyof Omit<typeof GraphQLScalarType, 'getJSType' | 'getValidationFunction'>;
export interface ModelFieldType {
    model: string;
    modelConstructor?: ModelMeta<PersistentModel>;
}
/**
 * @private
 * @param obj
 * @returns `true` if the given field specifies a Model.
 */
export declare function isModelFieldType<_ extends PersistentModel>(obj: any): obj is ModelFieldType;
export interface NonModelFieldType {
    nonModel: string;
}
/**
 * @private
 * @param obj
 * @returns `true` if the given field specifies a custom non-model type.
 */
export declare function isNonModelFieldType(obj: any): obj is NonModelFieldType;
interface EnumFieldType {
    enum: string;
}
/**
 * @private
 * @param obj
 * @returns `true` if the object is an `EnumFieldType`.
 */
export declare function isEnumFieldType(obj: any): obj is EnumFieldType;
export interface ModelField {
    name: string;
    type: keyof Omit<typeof GraphQLScalarType, 'getJSType' | 'getValidationFunction'> | ModelFieldType | NonModelFieldType | EnumFieldType;
    isArray: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isArrayNullable?: boolean;
    association?: ModelAssociation;
    attributes?: ModelAttributes[];
}
export type NonModelTypeConstructor<T> = new (init: T) => T;
export interface PersistentModelConstructor<T extends PersistentModel> {
    new (init: ModelInit<T, PersistentModelMetaData<T>>): T;
    copyOf(src: T, mutator: (draft: MutableModel<T, PersistentModelMetaData<T>>) => void): T;
}
/**
 * @private
 * Internal use of Amplify only.
 *
 * Indicates to use lazy models or eager models.
 */
export declare class LazyLoadingDisabled {
    disabled: true;
}
/**
 * @private
 * Internal use of Amplify only.
 *
 * Indicates to use lazy models or eager models.
 */
export declare class LazyLoading {
}
export type TypeConstructorMap = Record<string, PersistentModelConstructor<any> | NonModelTypeConstructor<unknown>>;
/**
 * Each identifier type is represented using nominal types, see:
 * https://basarat.gitbook.io/typescript/main-1/nominaltyping
 */
export declare const __identifierBrand__: unique symbol;
export type IdentifierBrand<T, K> = T & {
    [__identifierBrand__]: K;
};
interface GenericIdentifier {
    field: any;
}
export type ManagedIdentifier<T, F extends keyof T> = IdentifierBrand<{
    field: F extends string ? F : never;
    type: T;
}, 'ManagedIdentifier'>;
export type OptionallyManagedIdentifier<T, F extends keyof T> = IdentifierBrand<{
    field: F extends string ? F : never;
    type: T;
}, 'OptionallyManagedIdentifier'>;
export type CompositeIdentifier<T, K extends (keyof T)[]> = IdentifierBrand<{
    fields: K;
    type: T;
}, 'CompositeIdentifier'>;
export type CustomIdentifier<T, K extends keyof T> = CompositeIdentifier<T, [
    K
]>;
export type Identifier<T> = ManagedIdentifier<T, any> | OptionallyManagedIdentifier<T, any> | CompositeIdentifier<T, any> | CustomIdentifier<T, any>;
export type IdentifierFields<T extends PersistentModel, M extends PersistentModelMetaData<T> = never> = (MetadataOrDefault<T, M>['identifier'] extends ManagedIdentifier<any, any> | OptionallyManagedIdentifier<any, any> ? MetadataOrDefault<T, M>['identifier']['field'] : MetadataOrDefault<T, M>['identifier'] extends CompositeIdentifier<T, infer B> ? B[number] : MetadataOrDefault<T, M>['identifier'] extends GenericIdentifier ? MetadataOrDefault<T, M>['identifier']['field'] : unknown) & string;
export type IdentifierFieldsForInit<T extends PersistentModel, M extends PersistentModelMetaData<T>> = MetadataOrDefault<T, M>['identifier'] extends DefaultPersistentModelMetaData | ManagedIdentifier<T, any> ? never : MetadataOrDefault<T, M>['identifier'] extends OptionallyManagedIdentifier<T, any> ? IdentifierFields<T, M> : MetadataOrDefault<T, M>['identifier'] extends CompositeIdentifier<T, any> ? IdentifierFields<T, M> : never;
export declare const __modelMeta__: unique symbol;
export interface PersistentModelMetaData<T> {
    identifier?: Identifier<T>;
    readOnlyFields?: string;
}
export interface AsyncCollection<T> extends AsyncIterable<T> {
    toArray(options?: {
        max?: number;
    }): Promise<T[]>;
}
export type SettableFieldType<T> = T extends Promise<infer InnerPromiseType> ? undefined extends InnerPromiseType ? InnerPromiseType | null : InnerPromiseType : T extends AsyncCollection<infer InnerCollectionType> ? InnerCollectionType[] | undefined : undefined extends T ? T | null : T;
export type PredicateFieldType<T> = NonNullable<Scalar<T extends Promise<infer InnerPromiseType> ? InnerPromiseType : T extends AsyncCollection<infer InnerCollectionType> ? InnerCollectionType : T>>;
type KeysOfType<T, FilterType> = {
    [P in keyof T]: T[P] extends FilterType ? P : never;
}[keyof T];
type KeysOfSuperType<T, FilterType> = {
    [P in keyof T]: FilterType extends T[P] ? P : never;
}[keyof T];
type OptionalRelativesOf<T> = KeysOfType<T, AsyncCollection<any>> | KeysOfSuperType<T, Promise<undefined>>;
type OmitOptionalRelatives<T> = Omit<T, OptionalRelativesOf<T>>;
type PickOptionalRelatives<T> = Pick<T, OptionalRelativesOf<T>>;
export interface DefaultPersistentModelMetaData {
    identifier: ManagedIdentifier<{
        id: string;
    }, 'id'>;
    readOnlyFields: never;
}
export type MetadataOrDefault<T extends PersistentModel, _ extends PersistentModelMetaData<T> = never> = T extends {
    [__modelMeta__]: PersistentModelMetaData<T>;
} ? T[typeof __modelMeta__] : DefaultPersistentModelMetaData;
export type PersistentModel = Readonly<Record<string, any>>;
export type MetadataReadOnlyFields<T extends PersistentModel, M extends PersistentModelMetaData<T>> = Extract<MetadataOrDefault<T, M>['readOnlyFields'] | M['readOnlyFields'], keyof T>;
export type ModelInitBase<T extends PersistentModel, M extends PersistentModelMetaData<T> = {}> = Omit<T, typeof __modelMeta__ | IdentifierFields<T, M> | MetadataReadOnlyFields<T, M>> & (MetadataOrDefault<T, M>['identifier'] extends OptionallyManagedIdentifier<T, any> ? Partial<Pick<T, IdentifierFieldsForInit<T, M>>> : Required<Pick<T, IdentifierFieldsForInit<T, M>>>);
export type ModelInit<T extends PersistentModel, M extends PersistentModelMetaData<T> = {}> = {
    [P in keyof OmitOptionalRelatives<ModelInitBase<T, M>>]: SettableFieldType<ModelInitBase<T, M>[P]>;
} & {
    [P in keyof PickOptionalRelatives<ModelInitBase<T, M>>]+?: SettableFieldType<ModelInitBase<T, M>[P]>;
};
type DeepWritable<T> = {
    -readonly [P in keyof T]: T[P] extends TypeName<T[P]> ? T[P] : T[P] extends Promise<infer InnerPromiseType> ? undefined extends InnerPromiseType ? InnerPromiseType | null : InnerPromiseType : T[P] extends AsyncCollection<infer InnerCollectionType> ? InnerCollectionType[] | undefined | null : DeepWritable<T[P]>;
};
export type MutableModel<T extends PersistentModel, M extends PersistentModelMetaData<T> = {}> = DeepWritable<Omit<T, IdentifierFields<T, M> | MetadataReadOnlyFields<T, M>>> & Readonly<Pick<T, IdentifierFields<T, M> | MetadataReadOnlyFields<T, M>>>;
export interface ModelInstanceMetadata {
    _version: number;
    _lastChangedAt: number;
    _deleted: boolean;
}
export type IdentifierFieldValue<T extends PersistentModel, M extends PersistentModelMetaData<T>> = MetadataOrDefault<T, M>['identifier'] extends CompositeIdentifier<T, any> ? MetadataOrDefault<T, M>['identifier']['fields'] extends [any] ? T[MetadataOrDefault<T, M>['identifier']['fields'][0]] : never : MetadataOrDefault<T, M>['identifier'] extends GenericIdentifier ? T[MetadataOrDefault<T, M>['identifier']['field']] : unknown;
export type IdentifierFieldOrIdentifierObject<T extends PersistentModel, M extends PersistentModelMetaData<T>> = Pick<T, IdentifierFields<T, M>> | IdentifierFieldValue<T, M>;
/**
 * @private
 * @param obj
 * @param modelDefinition
 * @returns `true` if the given item is an object that has all identifier fields populated.
 */
export declare function isIdentifierObject<T extends PersistentModel>(obj: any, modelDefinition: SchemaModel): obj is IdentifierFields<T extends PersistentModel ? T : never, any>;
export declare enum OpType {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export type SubscriptionMessage<T extends PersistentModel> = Pick<InternalSubscriptionMessage<T>, 'opType' | 'element' | 'model' | 'condition'>;
export interface InternalSubscriptionMessage<T extends PersistentModel> {
    opType: OpType;
    element: T;
    model: PersistentModelConstructor<T>;
    condition: PredicatesGroup<T> | null;
    savedElement?: T;
}
export interface DataStoreSnapshot<T extends PersistentModel> {
    items: T[];
    isSynced: boolean;
}
export type PredicateExpression<M extends PersistentModel, FT> = TypeName<FT> extends keyof MapTypeToOperands<FT> ? (operator: keyof MapTypeToOperands<FT>[TypeName<FT>], operand: MapTypeToOperands<FT>[TypeName<FT>][keyof MapTypeToOperands<FT>[TypeName<FT>]]) => ModelPredicate<M> : never;
interface EqualityOperators<T> {
    ne: T;
    eq: T;
}
type ScalarNumberOperators<T> = EqualityOperators<T> & {
    le: T;
    lt: T;
    ge: T;
    gt: T;
};
type NumberOperators<T> = ScalarNumberOperators<T> & {
    between: [T, T];
};
type StringOperators<T> = ScalarNumberOperators<T> & {
    beginsWith: T;
    contains: T;
    notContains: T;
};
type BooleanOperators<T> = EqualityOperators<T>;
interface ArrayOperators<T> {
    contains: T;
    notContains: T;
}
export type AllOperators = NumberOperators<any> & StringOperators<any> & ArrayOperators<any>;
interface MapTypeToOperands<T> {
    number: NumberOperators<NonNullable<T>>;
    string: StringOperators<NonNullable<T>>;
    boolean: BooleanOperators<NonNullable<T>>;
    'number[]': ArrayOperators<number>;
    'string[]': ArrayOperators<string>;
    'boolean[]': ArrayOperators<boolean>;
}
type TypeName<T> = T extends string ? 'string' : T extends number ? 'number' : T extends boolean ? 'boolean' : T extends string[] ? 'string[]' : T extends number[] ? 'number[]' : T extends boolean[] ? 'boolean[]' : never;
export interface PredicateGroups<T extends PersistentModel> {
    and(predicate: (predicate: ModelPredicate<T>) => ModelPredicate<T>): ModelPredicate<T>;
    or(predicate: (predicate: ModelPredicate<T>) => ModelPredicate<T>): ModelPredicate<T>;
    not(predicate: (predicate: ModelPredicate<T>) => ModelPredicate<T>): ModelPredicate<T>;
}
export type ModelPredicate<M extends PersistentModel> = {
    [K in keyof M]-?: PredicateExpression<M, NonNullable<M[K]>>;
} & PredicateGroups<M>;
export type ProducerModelPredicate<M extends PersistentModel> = (condition: ModelPredicate<M>) => ModelPredicate<M>;
export interface PredicatesGroup<T extends PersistentModel> {
    type: keyof PredicateGroups<T>;
    predicates: (PredicateObject<T> | PredicatesGroup<T>)[];
}
/**
 * @private
 * @param obj
 * @returns `true` if the given predicate field object, specifying an [in-]equality test against a field.
 */
export declare function isPredicateObj<T extends PersistentModel>(obj: any): obj is PredicateObject<T>;
/**
 * @private
 * @param obj
 * @returns `true` if the given predicate object is a "group" like "and", "or", or "not".
 */
export declare function isPredicateGroup<T extends PersistentModel>(obj: any): obj is PredicatesGroup<T>;
export interface PredicateObject<T extends PersistentModel> {
    field: keyof T;
    operator: keyof AllOperators;
    operand: any;
}
export declare enum QueryOne {
    FIRST = 0,
    LAST = 1
}
export type GraphQLField = Record<string, Record<string, string | number | [number, number]>>;
export type GraphQLCondition = Partial<GraphQLField | {
    and: [GraphQLCondition];
    or: [GraphQLCondition];
    not: GraphQLCondition;
}>;
export type GraphQLFilter = Partial<GraphQLField | {
    and: GraphQLFilter[];
} | {
    or: GraphQLFilter[];
} | {
    not: GraphQLFilter;
}>;
export interface ProducerPaginationInput<T extends PersistentModel> {
    sort?: ProducerSortPredicate<T>;
    limit?: number;
    page?: number;
}
export type ObserveQueryOptions<T extends PersistentModel> = Pick<ProducerPaginationInput<T>, 'sort'>;
export interface PaginationInput<T extends PersistentModel> {
    sort?: SortPredicate<T>;
    limit?: number;
    page?: number;
}
export type ProducerSortPredicate<M extends PersistentModel> = (condition: SortPredicate<M>) => SortPredicate<M>;
export type SortPredicate<T extends PersistentModel> = {
    [K in keyof T]-?: SortPredicateExpression<T, NonNullable<T[K]>>;
};
export type SortPredicateExpression<M extends PersistentModel, FT> = TypeName<FT> extends keyof MapTypeToOperands<FT> ? (sortDirection: keyof typeof SortDirection) => SortPredicate<M> : never;
export declare enum SortDirection {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING"
}
export type SortPredicatesGroup<T extends PersistentModel> = SortPredicateObject<T>[];
export interface SortPredicateObject<T extends PersistentModel> {
    field: keyof T;
    sortDirection: keyof typeof SortDirection;
}
export interface SystemComponent {
    setUp(schema: InternalSchema, namespaceResolver: NamespaceResolver, modelInstanceCreator: ModelInstanceCreator, getModelConstructorByModelName: (namsespaceName: NAMESPACES, modelName: string) => PersistentModelConstructor<any>, appId?: string): Promise<void>;
}
export type NamespaceResolver = (modelConstructor: PersistentModelConstructor<any>) => string;
export interface ControlMessageType<T> {
    type: T;
    data?: any;
}
export interface RelationType {
    fieldName: string;
    modelName: string;
    relationType: 'HAS_ONE' | 'HAS_MANY' | 'BELONGS_TO';
    targetName?: string;
    targetNames?: string[];
    associatedWith?: string | string[];
}
interface IndexOptions {
    unique?: boolean;
}
export type IndexesType = [string, string[], IndexOptions?][];
export type RelationshipType = Record<string, {
    indexes: IndexesType;
    relationTypes: RelationType[];
}>;
export interface KeyType {
    primaryKey?: string[];
    compositeKeys?: Set<string>[];
}
export type ModelKeys = Record<string, KeyType>;
export interface DataStoreConfig {
    DataStore?: {
        authModeStrategyType?: AuthModeStrategyType;
        conflictHandler?: ConflictHandler;
        errorHandler?(error: SyncError<PersistentModel>): void;
        maxRecordsToSync?: number;
        syncPageSize?: number;
        fullSyncInterval?: number;
        syncExpressions?: SyncExpression[];
        authProviders?: AuthProviders;
        storageAdapter?: Adapter;
    };
    authModeStrategyType?: AuthModeStrategyType;
    conflictHandler?: ConflictHandler;
    errorHandler?(error: SyncError<PersistentModel>): void;
    maxRecordsToSync?: number;
    syncPageSize?: number;
    fullSyncInterval?: number;
    syncExpressions?: SyncExpression[];
    authProviders?: AuthProviders;
    storageAdapter?: Adapter;
}
export interface AuthProviders {
    functionAuthProvider(): {
        token: string;
    } | Promise<{
        token: string;
    }>;
}
export declare enum AuthModeStrategyType {
    DEFAULT = "DEFAULT",
    MULTI_AUTH = "MULTI_AUTH"
}
export type AuthModeStrategyReturn = GraphQLAuthMode | GraphQLAuthMode[] | undefined | null;
export interface AuthModeStrategyParams {
    schema: InternalSchema;
    modelName: string;
    operation: ModelOperation;
}
export type AuthModeStrategy = (authModeStrategyParams: AuthModeStrategyParams) => AuthModeStrategyReturn | Promise<AuthModeStrategyReturn>;
export declare enum ModelOperation {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export type ModelAuthModes = Record<string, {
    [Property in ModelOperation]: GraphQLAuthMode[];
}>;
export type SyncExpression = Promise<{
    modelConstructor: any;
    conditionProducer(c?: any): any;
}>;
type Option0 = [];
type Option1<T extends PersistentModel> = [V5ModelPredicate<T> | undefined];
type Option<T extends PersistentModel> = Option0 | Option1<T>;
interface Lookup<T extends PersistentModel> {
    0: ModelPredicateExtender<T> | Promise<ModelPredicateExtender<T>> | typeof PredicateAll | Promise<typeof PredicateAll | symbol>;
    1: PredicateInternalsKey | undefined;
}
type ConditionProducer<T extends PersistentModel, A extends Option<T>> = (...args: A) => A['length'] extends keyof Lookup<T> ? Lookup<T>[A['length']] : never;
/**
 * Build an expression that can be used to filter which items of a given Model
 * are synchronized down from the GraphQL service. E.g.,
 *
 * ```ts
 * import { DataStore, syncExpression } from 'aws-amplify/datastore';
 * import { Post, Comment } from './models';
 *
 *
 * DataStore.configure({
 * 	syncExpressions: [
 * 		syncExpression(Post, () => {
 * 			return (post) => post.rating.gt(5);
 * 		}),
 * 		syncExpression(Comment, () => {
 * 			return (comment) => comment.status.eq('active');
 * 		})
 * 	]
 * });
 * ```
 *
 * When DataStore starts syncing, only Posts with `rating > 5` and Comments with
 * `status === 'active'` will be synced down to the user's local store.
 *
 * @param modelConstructor The Model from the schema.
 * @param conditionProducer A function that builds a condition object that can describe how to filter the model.
 * @returns An sync expression object that can be attached to the DataStore `syncExpressions` configuration property.
 */
export declare function syncExpression<T extends PersistentModel, A extends Option<T>>(modelConstructor: PersistentModelConstructor<T>, conditionProducer: ConditionProducer<T, A>): Promise<{
    modelConstructor: PersistentModelConstructor<T>;
    conditionProducer: ConditionProducer<T, A>;
}>;
export interface SyncConflict {
    modelConstructor: PersistentModelConstructor<any>;
    localModel: PersistentModel;
    remoteModel: PersistentModel;
    operation: OpType;
    attempts: number;
}
export interface SyncError<T extends PersistentModel> {
    message: string;
    errorType: ErrorType;
    errorInfo?: string;
    recoverySuggestion?: string;
    model?: string;
    localModel: T;
    remoteModel: T;
    process: ProcessName;
    operation: string;
    cause?: Error;
}
export type ErrorType = 'ConfigError' | 'BadModel' | 'BadRecord' | 'Unauthorized' | 'Transient' | 'Unknown';
export declare enum ProcessName {
    'sync' = "sync",
    'mutate' = "mutate",
    'subscribe' = "subscribe"
}
export declare const DISCARD: unique symbol;
export type ConflictHandler = (conflict: SyncConflict) => Promise<PersistentModel | typeof DISCARD> | PersistentModel | typeof DISCARD;
export type ErrorHandler = (error: SyncError<PersistentModel>) => void;
export interface DeferredCallbackResolverOptions {
    callback(): void;
    maxInterval?: number;
    errorHandler?(error: string): void;
}
export declare enum LimitTimerRaceResolvedValues {
    LIMIT = "LIMIT",
    TIMER = "TIMER"
}
export interface AmplifyContext {
    InternalAPI: typeof InternalAPI;
}
export type MatchableTypes = string | string[] | number | number[] | boolean | boolean[];
export type AllFieldOperators = keyof AllOperators;
export type NonNeverKeys<T> = {
    [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];
export type WithoutNevers<T> = Pick<T, NonNeverKeys<T>>;
/**
 * A function that accepts a RecursiveModelPrecicate<T>, which it must use to
 * return a final condition.
 *
 * This is used in `DataStore.query()`, `DataStore.observe()`, and
 * `DataStore.observeQuery()` as the second argument. E.g.,
 *
 * ```
 * DataStore.query(MyModel, model => model.field.eq('some value'))
 * ```
 *
 * More complex queries should also be supported. E.g.,
 *
 * ```
 * DataStore.query(MyModel, model => model.and(m => [
 *   m.relatedEntity.or(relative => [
 *     relative.relativeField.eq('whatever'),
 *     relative.relativeField.eq('whatever else')
 *   ]),
 *   m.myModelField.ne('something')
 * ]))
 * ```
 */
export type RecursiveModelPredicateExtender<RT extends PersistentModel> = (lambda: RecursiveModelPredicate<RT>) => PredicateInternalsKey;
export type RecursiveModelPredicateAggregateExtender<RT extends PersistentModel> = (lambda: RecursiveModelPredicate<RT>) => PredicateInternalsKey[];
export type RecursiveModelPredicateOperator<RT extends PersistentModel> = (predicates: RecursiveModelPredicateAggregateExtender<RT>) => PredicateInternalsKey;
export type RecursiveModelPredicateNegation<RT extends PersistentModel> = (predicate: RecursiveModelPredicateExtender<RT>) => PredicateInternalsKey;
export type RecursiveModelPredicate<RT extends PersistentModel> = {
    [K in keyof RT]-?: PredicateFieldType<RT[K]> extends PersistentModel ? RecursiveModelPredicate<PredicateFieldType<RT[K]>> : ValuePredicate<RT, RT[K]>;
} & {
    or: RecursiveModelPredicateOperator<RT>;
    and: RecursiveModelPredicateOperator<RT>;
    not: RecursiveModelPredicateNegation<RT>;
} & PredicateInternalsKey;
/**
 * A function that accepts a ModelPrecicate<T>, which it must use to return a
 * final condition.
 *
 * This is used as predicates in `DataStore.save()`, `DataStore.delete()`, and
 * DataStore sync expressions.
 *
 * ```
 * DataStore.save(record, model => model.field.eq('some value'))
 * ```
 *
 * Logical operators are supported. But, condtiions are related records are
 * NOT supported. E.g.,
 *
 * ```
 * DataStore.delete(record, model => model.or(m => [
 * 	m.field.eq('whatever'),
 * 	m.field.eq('whatever else')
 * ]))
 * ```
 */
export type ModelPredicateExtender<RT extends PersistentModel> = (lambda: V5ModelPredicate<RT>) => PredicateInternalsKey;
export type ModelPredicateAggregateExtender<RT extends PersistentModel> = (lambda: V5ModelPredicate<RT>) => PredicateInternalsKey[];
export type ValuePredicate<_RT extends PersistentModel, MT extends MatchableTypes> = {
    [K in AllFieldOperators]: K extends 'between' ? (inclusiveLowerBound: Scalar<MT>, inclusiveUpperBound: Scalar<MT>) => PredicateInternalsKey : (operand: Scalar<MT>) => PredicateInternalsKey;
};
export type V5ModelPredicate<RT extends PersistentModel> = WithoutNevers<{
    [K in keyof RT]-?: PredicateFieldType<RT[K]> extends PersistentModel ? never : ValuePredicate<RT, RT[K]>;
}> & {
    or: ModelPredicateOperator<RT>;
    and: ModelPredicateOperator<RT>;
    not: ModelPredicateNegation<RT>;
} & PredicateInternalsKey;
export type ModelPredicateOperator<RT extends PersistentModel> = (predicates: ModelPredicateAggregateExtender<RT>) => PredicateInternalsKey;
export type ModelPredicateNegation<RT extends PersistentModel> = (predicate: ModelPredicateExtender<RT>) => PredicateInternalsKey;
/**
 * A pointer used by DataStore internally to lookup predicate details
 * that should not be exposed on public customer interfaces.
 */
export declare class PredicateInternalsKey {
    private __isPredicateInternalsKeySentinel;
}
export {};
