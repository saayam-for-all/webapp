import { isSchemaModelType } from './ModelType.mjs';
import { processSchema } from './SchemaProcessor.mjs';
import { allow } from './Authorization.mjs';
import { brand, getBrand } from './util/Brand.mjs';

const rdsSchemaBrandName = 'RDSSchema';
const rdsSchemaBrand = brand(rdsSchemaBrandName);
const ddbSchemaBrandName = 'DDBSchema';
const ddbSchemaBrand = brand(ddbSchemaBrandName);
/**
 * Filter the schema types down to only include the ModelTypes as SchemaModelType
 *
 * @param schemaContents The object containing all SchemaContent for this schema
 * @returns Only the schemaContents that are ModelTypes, coerced to the SchemaModelType surface
 */
const filterSchemaModelTypes = (schemaContents) => {
    const modelTypes = {};
    if (schemaContents) {
        Object.entries(schemaContents).forEach(([key, content]) => {
            if (isSchemaModelType(content)) {
                modelTypes[key] = content;
            }
        });
    }
    return modelTypes;
};
/**
 * Model Schema type guard
 * @param schema - api-next ModelSchema or string
 * @returns true if the given value is a ModelSchema
 */
const isModelSchema = (schema) => {
    return typeof schema === 'object' && schema.data !== undefined;
};
/**
 * Ensures that only supported entities are being added to the SQL schema through `addToSchema`
 * Models are not supported for brownfield SQL
 *
 * @param types - purposely widened to ModelSchemaContents, because we need to validate at runtime that a model is not being passed in here
 */
function validateAddToSchema(types) {
    for (const [name, type] of Object.entries(types)) {
        if (getBrand(type) === 'modelType') {
            throw new Error(`Invalid value specified for ${name} in addToSchema(). Models cannot be manually added to a SQL schema.`);
        }
    }
}
function _rdsSchema(types, config) {
    const data = {
        types,
        authorization: [],
        configuration: config,
    };
    const models = filterSchemaModelTypes(data.types);
    return {
        data,
        models,
        transform() {
            const internalSchema = {
                data,
                context: this.context,
            };
            return processSchema({ schema: internalSchema });
        },
        authorization(callback) {
            const rules = callback(allow);
            this.data.authorization = Array.isArray(rules) ? rules : [rules];
            const { authorization: _, ...rest } = this;
            return rest;
        },
        addToSchema(types) {
            validateAddToSchema(types);
            this.data.types = { ...this.data.types, ...types };
            const { addToSchema: _, ...rest } = this;
            return rest;
        },
        addQueries(types) {
            this.data.types = { ...this.data.types, ...types };
            const { addQueries: _, ...rest } = this;
            return rest;
        },
        addMutations(types) {
            this.data.types = { ...this.data.types, ...types };
            const { addMutations: _, ...rest } = this;
            return rest;
        },
        addSubscriptions(types) {
            this.data.types = { ...this.data.types, ...types };
            const { addSubscriptions: _, ...rest } = this;
            return rest;
        },
        setAuthorization(callback) {
            callback(models, this);
            const { setAuthorization: _, ...rest } = this;
            return rest;
        },
        setRelationships(callback) {
            const { setRelationships: _, ...rest } = this;
            // The relationships are added via `models.<Model>.relationships`
            // modifiers that's being called within the callback. They are modifying
            // by references on each model, so there is not anything else to be done
            // here.
            callback(models);
            return rest;
        },
        renameModels(callback) {
            const { renameModels: _, ...rest } = this;
            // returns an array of tuples [curName, newName]
            const changeLog = callback();
            changeLog.forEach(([curName, newName]) => {
                const currentType = data.types[curName];
                if (currentType === undefined) {
                    throw new Error(`Invalid renameModels call. ${curName} is not defined in the schema`);
                }
                if (typeof newName !== 'string' || newName.length < 1) {
                    throw new Error(`Invalid renameModels call. New name must be a non-empty string. Received: "${newName}"`);
                }
                models[newName] = currentType;
                data.types[newName] = currentType;
                models[newName].data.originalName = curName;
                delete models[curName];
                delete data.types[curName];
            });
            return rest;
        },
        ...rdsSchemaBrand,
    };
}
function _ddbSchema(types, config) {
    const data = {
        types,
        authorization: [],
        configuration: config,
    };
    return {
        data,
        transform() {
            const internalSchema = {
                data,
                context: this.context,
            };
            return processSchema({ schema: internalSchema });
        },
        authorization(callback) {
            const rules = callback(allow);
            this.data.authorization = Array.isArray(rules) ? rules : [rules];
            const { authorization: _, ...rest } = this;
            return rest;
        },
        models: filterSchemaModelTypes(data.types),
        ...ddbSchemaBrand,
    };
}
function bindConfigToSchema(config) {
    return (types) => {
        return (config.database.engine === 'dynamodb'
            ? _ddbSchema(types, config)
            : _rdsSchema(types, config));
    };
}
/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param types The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
const schema = bindConfigToSchema({ database: { engine: 'dynamodb' } });
/**
 * Configure wraps schema definition with non-default config to allow usecases other than
 * the default DynamoDB use-case.
 *
 * @param config The SchemaConfig augments the schema with content like the database type
 * @returns
 */
function configure(config) {
    return {
        schema: bindConfigToSchema(config),
    };
}
function isCustomPathData(obj) {
    return ('stack' in obj &&
        (typeof obj.stack === 'undefined' || typeof obj.stack === 'string') &&
        'entry' in obj &&
        typeof obj.entry === 'string');
}

export { configure, ddbSchemaBrandName, isCustomPathData, isModelSchema, rdsSchemaBrand, rdsSchemaBrandName, schema };
//# sourceMappingURL=ModelSchema.mjs.map
