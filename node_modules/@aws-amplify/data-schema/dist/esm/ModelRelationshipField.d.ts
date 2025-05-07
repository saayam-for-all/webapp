import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand } from './util';
import { AllowModifier, Authorization } from './Authorization';
/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
export declare const __auth: unique symbol;
declare const brandName = "modelRelationshipField";
/**
 * Model relationship types
 */
export declare enum ModelRelationshipTypes {
    hasOne = "hasOne",
    hasMany = "hasMany",
    belongsTo = "belongsTo"
}
type RelationshipTypes = `${ModelRelationshipTypes}`;
type ModelRelationshipFieldData = {
    fieldType: 'model';
    type: ModelRelationshipTypes;
    relatedModel: string;
    array: boolean;
    valueRequired: boolean;
    arrayRequired: boolean;
    references: string[];
    authorization: Authorization<any, any, any>[];
};
export type ModelRelationshipFieldParamShape = {
    type: 'model';
    relationshipType: string;
    relatedModel: string;
    array: boolean;
    valueRequired: boolean;
    references: string[];
    arrayRequired: boolean;
};
type ModelRelationshipFieldFunctions<T extends ModelRelationshipFieldParamShape, RM extends string | symbol, K extends keyof ModelRelationshipField<T, RM> = never> = {
    /**
     * When set, it requires the value of the relationship type to be required.
     */
    valueRequired(): ModelRelationshipField<SetTypeSubArg<T, 'valueRequired', true>, K | 'valueRequired'>;
    /**
     * When set, it requires the relationship to always return a value
     */
    required(): ModelRelationshipField<SetTypeSubArg<T, 'arrayRequired', true>, K | 'required'>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(allow => allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends Authorization<any, any, any>>(callback: (allow: AllowModifier) => AuthRuleType | AuthRuleType[]): ModelRelationshipField<T, K | 'authorization', K, AuthRuleType>;
};
/**
 * Model relationship field definition interface
 *
 * @param T - The shape of the model relationship field
 * @param RM - Adds structural separation with ModelField; easier to identify it when mapping to ClientTypes
 * @param K - The keys already defined
 */
export type ModelRelationshipField<T extends ModelRelationshipFieldParamShape, RM extends string | symbol, K extends keyof ModelRelationshipField<T, RM> = never, Auth = undefined> = Omit<ModelRelationshipFieldFunctions<T, RM, K>, K> & {
    [__auth]?: Auth;
} & Brand<typeof brandName>;
/**
 * Internal representation of Model Field that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalRelationshipField = ModelRelationshipField<ModelRelationshipFieldParamShape, string, never> & {
    data: ModelRelationshipFieldData;
};
export type RelationTypeFunctionOmitMapping<Type extends ModelRelationshipTypes> = Type extends ModelRelationshipTypes.belongsTo ? 'required' | 'valueRequired' : Type extends ModelRelationshipTypes.hasMany ? 'required' : Type extends ModelRelationshipTypes.hasOne ? 'valueRequired' : never;
/**
 * Model relationship type definition content
 *
 * @param RM - The related model name
 * @param RT - The relationship type
 * @param IsArray - Whether the relationship is an array
 */
export type ModelRelationshipTypeArgFactory<RM extends string, RT extends RelationshipTypes, IsArray extends boolean> = {
    type: 'model';
    relatedModel: RM;
    relationshipType: RT;
    array: IsArray;
    valueRequired: false;
    arrayRequired: false;
    references: string[];
};
/**
 * Create one-to-one relationship between two models using the `hasOne("MODEL_NAME", "REFERENCE_FIELD(s)")` method.
 * A hasOne relationship always uses a reference to the related model's identifier. Typically this is the `id` field
 * unless overwritten with the `identifier()` method.
 * @example
 * const schema = a.schema({
 *   Cart: a.model({
 *     items: a.string().required().array(),
 *     // 1. Create reference field
 *     customerId: a.id(),
 *     // 2. Create relationship field with the reference field
 *     customer: a.belongsTo('Customer', 'customerId'),
 *   }),
 *   Customer: a.model({
 *     name: a.string(),
 *     // 3. Create relationship field with the reference field
 *     //    from the Cart model
 *     activeCart: a.hasOne('Cart', 'customerId')
 *   }),
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#model-a-one-to-one-relationship}
 * @param relatedModel the name of the related model
 * @param references the field(s) that should be used to reference the related model
 * @returns a one-to-one relationship definition
 */
export declare function hasOne<RM extends string>(relatedModel: RM, references: string | string[]): ModelRelationshipField<ModelRelationshipTypeArgFactory<RM, ModelRelationshipTypes.hasOne, false>, RM, "valueRequired", undefined>;
/**
 * Create a one-directional one-to-many relationship between two models using the `hasMany("MODEL_NAME", "REFERENCE_FIELD(s)")` method.
 * @example
 * const schema = a.schema({
 *   Member: a.model({
 *     name: a.string().required(),
 *     // 1. Create a reference field
 *     teamId: a.id(),
 *     // 2. Create a belongsTo relationship with the reference field
 *     team: a.belongsTo('Team', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 *
 *   Team: a.model({
 *     mantra: a.string().required(),
 *     // 3. Create a hasMany relationship with the reference field
 *     //    from the `Member`s model.
 *     members: a.hasMany('Member', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/#model-one-to-many-relationships}
 * @param relatedModel the name of the related model
 * @param references the field(s) that should be used to reference the related model
 * @returns a one-to-many relationship definition
 */
export declare function hasMany<RM extends string>(relatedModel: RM, references: string | string[]): ModelRelationshipField<ModelRelationshipTypeArgFactory<RM, ModelRelationshipTypes.hasMany, true>, RM, "required", undefined>;
/**
 * Use `belongsTo()` to create a field to query the related `hasOne()` or `hasMany()` relationship.
 * The belongsTo() method requires that a hasOne() or hasMany() relationship already exists from
 * parent to the related model.
 *
 * @example
 * // one-to-many relationship
 * const schema = a.schema({
 *   Member: a.model({
 *     name: a.string().required(),
 *     // 1. Create a reference field
 *     teamId: a.id(),
 *     // 2. Create a belongsTo relationship with the reference field
 *     team: a.belongsTo('Team', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 *
 *   Team: a.model({
 *     mantra: a.string().required(),
 *     // 3. Create a hasMany relationship with the reference field
 *     //    from the `Member`s model.
 *     members: a.hasMany('Member', 'teamId'),
 *   })
 *   .authorization(allow => [allow.publicApiKey()]),
 * });
 * @example
 * // one-to-one relationship
 * const schema = a.schema({
 *   Cart: a.model({
 *     items: a.string().required().array(),
 *     // 1. Create reference field
 *     customerId: a.id(),
 *     // 2. Create relationship field with the reference field
 *     customer: a.belongsTo('Customer', 'customerId'),
 *   }),
 *   Customer: a.model({
 *     name: a.string(),
 *     // 3. Create relationship field with the reference field
 *     //    from the Cart model
 *     activeCart: a.hasOne('Cart', 'customerId')
 *   }),
 * });
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/}
 * @param relatedModel name of the related `.hasOne()` or `.hasMany()` model
 * @param references the field(s) that should be used to reference the related model
 * @returns a belong-to relationship definition
 */
export declare function belongsTo<RM extends string>(relatedModel: RM, references: string | string[]): ModelRelationshipField<ModelRelationshipTypeArgFactory<RM, ModelRelationshipTypes.belongsTo, false>, RM, "required" | "valueRequired", undefined>;
export {};
