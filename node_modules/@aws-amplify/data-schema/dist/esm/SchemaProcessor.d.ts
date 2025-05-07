import type { InternalSchema } from './ModelSchema';
import { DerivedApiDefinition } from '@aws-amplify/data-schema-types';
/**
 * Returns API definition from ModelSchema or string schema
 * @param arg - { schema }
 * @returns DerivedApiDefinition that conforms to IAmplifyGraphqlDefinition
 */
export declare function processSchema(arg: {
    schema: InternalSchema;
}): DerivedApiDefinition;
