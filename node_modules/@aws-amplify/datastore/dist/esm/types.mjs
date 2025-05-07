import { isAWSIPAddress, isAWSPhone, isAWSURL, isAWSJSON, isAWSEmail, isAWSTimestamp, isAWSDateTime, isAWSTime, isAWSDate, extractPrimaryKeyFieldNames } from './util.mjs';

/**
 * @private
 * @param obj
 * @returns `true` if the given object likely represents a model in a schema.
 */
function isSchemaModel(obj) {
    return obj && obj.pluralName !== undefined;
}
/**
 * @private
 * @param m
 * @returns `true` if the given schema entry defines Schema Model attributes.
 */
function isSchemaModelWithAttributes(m) {
    return isSchemaModel(m) && m.attributes !== undefined;
}
/**
 * @private
 * @param obj
 * @returns `true` if the object is an `AssociatedWith` definition.
 */
function isAssociatedWith(obj) {
    return obj && obj.associatedWith;
}
/**
 * @private
 * @param obj
 * @returns `true` if the given object specifies either `targetName` or `targetNames`.
 */
function isTargetNameAssociation(obj) {
    return obj?.targetName || obj?.targetNames;
}
/**
 * @private
 * @param obj
 * @param fieldName
 * @returns Truthy if the object has a `FieldAssociation` for the given `fieldName`.
 */
function isFieldAssociation(obj, fieldName) {
    return obj?.fields[fieldName]?.association?.connectionType;
}
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute is an auth attribute with rules.
 */
function isModelAttributeAuth(attr) {
    return (attr.type === 'auth' &&
        attr.properties &&
        attr.properties.rules &&
        attr.properties.rules.length > 0);
}
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute is a key field.
 */
function isModelAttributeKey(attr) {
    return (attr.type === 'key' &&
        attr.properties &&
        attr.properties.fields &&
        attr.properties.fields.length > 0);
}
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute is a primary key, indicated by the key being unnamed.
 */
function isModelAttributePrimaryKey(attr) {
    return isModelAttributeKey(attr) && attr.properties.name === undefined;
}
/**
 * @private
 * @param attr
 * @returns `true` if the given attribute represents a composite key with multiple fields.
 */
function isModelAttributeCompositeKey(attr) {
    return (isModelAttributeKey(attr) &&
        attr.properties.name !== undefined &&
        attr.properties.fields.length > 2);
}
var ModelAttributeAuthAllow;
(function (ModelAttributeAuthAllow) {
    ModelAttributeAuthAllow["CUSTOM"] = "custom";
    ModelAttributeAuthAllow["OWNER"] = "owner";
    ModelAttributeAuthAllow["GROUPS"] = "groups";
    ModelAttributeAuthAllow["PRIVATE"] = "private";
    ModelAttributeAuthAllow["PUBLIC"] = "public";
})(ModelAttributeAuthAllow || (ModelAttributeAuthAllow = {}));
var ModelAttributeAuthProvider;
(function (ModelAttributeAuthProvider) {
    ModelAttributeAuthProvider["FUNCTION"] = "function";
    ModelAttributeAuthProvider["USER_POOLS"] = "userPools";
    ModelAttributeAuthProvider["OIDC"] = "oidc";
    ModelAttributeAuthProvider["IAM"] = "iam";
    ModelAttributeAuthProvider["API_KEY"] = "apiKey";
})(ModelAttributeAuthProvider || (ModelAttributeAuthProvider = {}));
var GraphQLScalarType;
(function (GraphQLScalarType) {
    GraphQLScalarType[GraphQLScalarType["ID"] = 0] = "ID";
    GraphQLScalarType[GraphQLScalarType["String"] = 1] = "String";
    GraphQLScalarType[GraphQLScalarType["Int"] = 2] = "Int";
    GraphQLScalarType[GraphQLScalarType["Float"] = 3] = "Float";
    GraphQLScalarType[GraphQLScalarType["Boolean"] = 4] = "Boolean";
    GraphQLScalarType[GraphQLScalarType["AWSDate"] = 5] = "AWSDate";
    GraphQLScalarType[GraphQLScalarType["AWSTime"] = 6] = "AWSTime";
    GraphQLScalarType[GraphQLScalarType["AWSDateTime"] = 7] = "AWSDateTime";
    GraphQLScalarType[GraphQLScalarType["AWSTimestamp"] = 8] = "AWSTimestamp";
    GraphQLScalarType[GraphQLScalarType["AWSEmail"] = 9] = "AWSEmail";
    GraphQLScalarType[GraphQLScalarType["AWSJSON"] = 10] = "AWSJSON";
    GraphQLScalarType[GraphQLScalarType["AWSURL"] = 11] = "AWSURL";
    GraphQLScalarType[GraphQLScalarType["AWSPhone"] = 12] = "AWSPhone";
    GraphQLScalarType[GraphQLScalarType["AWSIPAddress"] = 13] = "AWSIPAddress";
})(GraphQLScalarType || (GraphQLScalarType = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace
(function (GraphQLScalarType) {
    function getJSType(scalar) {
        switch (scalar) {
            case 'Boolean':
                return 'boolean';
            case 'ID':
            case 'String':
            case 'AWSDate':
            case 'AWSTime':
            case 'AWSDateTime':
            case 'AWSEmail':
            case 'AWSURL':
            case 'AWSPhone':
            case 'AWSIPAddress':
                return 'string';
            case 'Int':
            case 'Float':
            case 'AWSTimestamp':
                return 'number';
            case 'AWSJSON':
                return 'object';
            default:
                throw new Error('Invalid scalar type');
        }
    }
    GraphQLScalarType.getJSType = getJSType;
    function getValidationFunction(scalar) {
        switch (scalar) {
            case 'AWSDate':
                return isAWSDate;
            case 'AWSTime':
                return isAWSTime;
            case 'AWSDateTime':
                return isAWSDateTime;
            case 'AWSTimestamp':
                return isAWSTimestamp;
            case 'AWSEmail':
                return isAWSEmail;
            case 'AWSJSON':
                return isAWSJSON;
            case 'AWSURL':
                return isAWSURL;
            case 'AWSPhone':
                return isAWSPhone;
            case 'AWSIPAddress':
                return isAWSIPAddress;
            default:
                return undefined;
        }
    }
    GraphQLScalarType.getValidationFunction = getValidationFunction;
})(GraphQLScalarType || (GraphQLScalarType = {}));
/**
 * @private
 * @returns `true` if the given field specifies a scalar type.
 */
function isGraphQLScalarType(obj) {
    return obj && GraphQLScalarType[obj] !== undefined;
}
/**
 * @private
 * @param obj
 * @returns `true` if the given field specifies a Model.
 */
function isModelFieldType(obj) {
    const modelField = 'model';
    if (obj && obj[modelField])
        return true;
    return false;
}
/**
 * @private
 * @param obj
 * @returns `true` if the given field specifies a custom non-model type.
 */
function isNonModelFieldType(obj) {
    const typeField = 'nonModel';
    if (obj && obj[typeField])
        return true;
    return false;
}
/**
 * @private
 * @param obj
 * @returns `true` if the object is an `EnumFieldType`.
 */
function isEnumFieldType(obj) {
    const modelField = 'enum';
    if (obj && obj[modelField])
        return true;
    return false;
}
/**
 * @private
 * @param obj
 * @param modelDefinition
 * @returns `true` if the given item is an object that has all identifier fields populated.
 */
function isIdentifierObject(obj, modelDefinition) {
    const keys = extractPrimaryKeyFieldNames(modelDefinition);
    return (typeof obj === 'object' && obj && keys.every(k => obj[k] !== undefined));
}
// #endregion
// #region Subscription messages
var OpType;
(function (OpType) {
    OpType["INSERT"] = "INSERT";
    OpType["UPDATE"] = "UPDATE";
    OpType["DELETE"] = "DELETE";
})(OpType || (OpType = {}));
/**
 * @private
 * @param obj
 * @returns `true` if the given predicate field object, specifying an [in-]equality test against a field.
 */
function isPredicateObj(obj) {
    return obj && obj.field !== undefined;
}
/**
 * @private
 * @param obj
 * @returns `true` if the given predicate object is a "group" like "and", "or", or "not".
 */
function isPredicateGroup(obj) {
    return obj && obj.type !== undefined;
}
var QueryOne;
(function (QueryOne) {
    QueryOne[QueryOne["FIRST"] = 0] = "FIRST";
    QueryOne[QueryOne["LAST"] = 1] = "LAST";
})(QueryOne || (QueryOne = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ASCENDING"] = "ASCENDING";
    SortDirection["DESCENDING"] = "DESCENDING";
})(SortDirection || (SortDirection = {}));
var AuthModeStrategyType;
(function (AuthModeStrategyType) {
    AuthModeStrategyType["DEFAULT"] = "DEFAULT";
    AuthModeStrategyType["MULTI_AUTH"] = "MULTI_AUTH";
})(AuthModeStrategyType || (AuthModeStrategyType = {}));
var ModelOperation;
(function (ModelOperation) {
    ModelOperation["CREATE"] = "CREATE";
    ModelOperation["READ"] = "READ";
    ModelOperation["UPDATE"] = "UPDATE";
    ModelOperation["DELETE"] = "DELETE";
})(ModelOperation || (ModelOperation = {}));
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
async function syncExpression(modelConstructor, conditionProducer) {
    return {
        modelConstructor,
        conditionProducer,
    };
}
var ProcessName;
(function (ProcessName) {
    ProcessName["sync"] = "sync";
    ProcessName["mutate"] = "mutate";
    ProcessName["subscribe"] = "subscribe";
})(ProcessName || (ProcessName = {}));
const DISCARD = Symbol('DISCARD');
var LimitTimerRaceResolvedValues;
(function (LimitTimerRaceResolvedValues) {
    LimitTimerRaceResolvedValues["LIMIT"] = "LIMIT";
    LimitTimerRaceResolvedValues["TIMER"] = "TIMER";
})(LimitTimerRaceResolvedValues || (LimitTimerRaceResolvedValues = {}));
/**
 * A pointer used by DataStore internally to lookup predicate details
 * that should not be exposed on public customer interfaces.
 */
class PredicateInternalsKey {
    constructor() {
        this.__isPredicateInternalsKeySentinel = true;
    }
}
// #endregion

export { AuthModeStrategyType, DISCARD, GraphQLScalarType, LimitTimerRaceResolvedValues, ModelAttributeAuthAllow, ModelAttributeAuthProvider, ModelOperation, OpType, PredicateInternalsKey, ProcessName, QueryOne, SortDirection, isAssociatedWith, isEnumFieldType, isFieldAssociation, isGraphQLScalarType, isIdentifierObject, isModelAttributeAuth, isModelAttributeCompositeKey, isModelAttributeKey, isModelAttributePrimaryKey, isModelFieldType, isNonModelFieldType, isPredicateGroup, isPredicateObj, isSchemaModel, isSchemaModelWithAttributes, isTargetNameAssociation, syncExpression };
//# sourceMappingURL=types.mjs.map
