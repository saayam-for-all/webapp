import type { SchemaModel, ModelIntrospectionSchema } from '../bridge-types';
export declare const getSecondaryIndexesFromSchemaModel: (model: SchemaModel) => {
    queryField: string;
    pk: string;
    sk: string[];
}[];
/**
 * returns graphQLOperationsInfo, but filters out operations that were disabled via model().disableOperations([...])
 */
export declare const excludeDisabledOps: (mis: ModelIntrospectionSchema, modelName: string) => {
    readonly CREATE: {
        readonly operationPrefix: "create";
        readonly usePlural: false;
    };
    readonly GET: {
        readonly operationPrefix: "get";
        readonly usePlural: false;
    };
    readonly UPDATE: {
        readonly operationPrefix: "update";
        readonly usePlural: false;
    };
    readonly DELETE: {
        readonly operationPrefix: "delete";
        readonly usePlural: false;
    };
    readonly LIST: {
        readonly operationPrefix: "list";
        readonly usePlural: true;
    };
    readonly INDEX_QUERY: {
        readonly operationPrefix: "";
        readonly usePlural: false;
    };
    readonly ONCREATE: {
        readonly operationPrefix: "onCreate";
        readonly usePlural: false;
    };
    readonly ONUPDATE: {
        readonly operationPrefix: "onUpdate";
        readonly usePlural: false;
    };
    readonly ONDELETE: {
        readonly operationPrefix: "onDelete";
        readonly usePlural: false;
    };
    readonly OBSERVEQUERY: {
        readonly operationPrefix: "observeQuery";
        readonly usePlural: false;
    };
} | {
    [k: string]: {
        readonly operationPrefix: "create";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "get";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "update";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "delete";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "list";
        readonly usePlural: true;
    } | {
        readonly operationPrefix: "";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "onCreate";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "onUpdate";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "onDelete";
        readonly usePlural: false;
    } | {
        readonly operationPrefix: "observeQuery";
        readonly usePlural: false;
    };
};
