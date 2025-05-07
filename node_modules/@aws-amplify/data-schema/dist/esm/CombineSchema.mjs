import { brand } from './util/Brand.mjs';

const CombinedSchemaBrandName = 'CombinedSchema';
const combinedSchemaBrand = brand(CombinedSchemaBrandName);
/**
 * The interface for merging up to 50 schemas into a single API.
 * @param schemas The schemas to combine into a single API
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
function combine(schemas) {
    return internalCombine(schemas);
}
function internalCombine(schemas) {
    validateDuplicateTypeNames(schemas);
    const combined = {
        ...combinedSchemaBrand,
        schemas: schemas,
    };
    for (const schema of combined.schemas) {
        schema.context = combined;
    }
    return combined;
}
function validateDuplicateTypeNames(schemas) {
    const allSchemaKeys = schemas.flatMap((s) => Object.keys(s.data.types));
    const keySet = new Set();
    const duplicateKeySet = new Set();
    allSchemaKeys.forEach((key) => {
        if (keySet.has(key)) {
            duplicateKeySet.add(key);
        }
        else {
            keySet.add(key);
        }
    });
    if (duplicateKeySet.size > 0) {
        throw new Error(`The schemas you are attempting to combine have a name collision. Please remove or rename ${Array.from(duplicateKeySet).join(', ')}.`);
    }
}

export { combine, combinedSchemaBrand };
//# sourceMappingURL=CombineSchema.mjs.map
