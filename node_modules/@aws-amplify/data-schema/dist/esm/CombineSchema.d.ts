import { GenericModelSchema } from './ModelSchema';
import { Brand, IndexLimitUnion } from './util';
declare const COMBINED_SCHEMA_LIMIT = 50;
export type CombinedSchemaIndexesUnion = IndexLimitUnion<typeof COMBINED_SCHEMA_LIMIT>[number];
declare const CombinedSchemaBrandName = "CombinedSchema";
export declare const combinedSchemaBrand: Brand<"CombinedSchema">;
export type CombinedSchemaBrand = Brand<typeof CombinedSchemaBrandName>;
/**
 * CombinedModel schema definition interface
 *
 * @param Schemas - The schemas to combine into a single API
 */
export type CombinedModelSchema<Schemas extends GenericModelSchema<any>[]> = CombinedSchemaBrand & {
    schemas: [...Schemas];
};
/**
 * The interface for merging up to 50 schemas into a single API.
 * @param schemas The schemas to combine into a single API
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export declare function combine<Schema extends GenericModelSchema<any>[]>(schemas: [...Schema]): CombinedModelSchema<Schema>;
export {};
