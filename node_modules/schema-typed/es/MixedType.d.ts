import { SchemaDeclaration, CheckResult, ValidCallbackType, AsyncValidCallbackType, RuleType, ErrorMessageType, TypeName, PlainObject } from './types';
import { MixedTypeLocale } from './locales';
type ProxyOptions = {
    checkIfValueExists?: boolean;
};
export declare const schemaSpecKey = "objectTypeSchemaSpec";
export declare const arrayTypeSchemaSpec = "arrayTypeSchemaSpec";
/**
 * Get the field type from the schema object
 */
export declare function getFieldType(schemaSpec: any, fieldName: string, nestedObject?: boolean): any;
/**
 * Get the field value from the data object
 */
export declare function getFieldValue(data: PlainObject, fieldName: string, nestedObject?: boolean): any;
export declare class MixedType<ValueType = any, DataType = any, E = ErrorMessageType, L = any> {
    readonly $typeName?: string;
    protected required: boolean;
    protected requiredMessage: E | string;
    protected trim: boolean;
    protected emptyAllowed: boolean;
    protected rules: RuleType<ValueType, DataType, E | string>[];
    protected priorityRules: RuleType<ValueType, DataType, E | string>[];
    protected fieldLabel?: string;
    $schemaSpec: SchemaDeclaration<DataType, E>;
    value: any;
    locale: L & MixedTypeLocale;
    otherFields: string[];
    proxyOptions: ProxyOptions;
    constructor(name?: TypeName);
    setSchemaOptions(schemaSpec: SchemaDeclaration<DataType, E>, value: any): void;
    check(value?: any, data?: DataType, fieldName?: string | string[]): CheckResult<string | E, PlainObject<any>>;
    checkAsync(value?: any, data?: DataType, fieldName?: string | string[]): Promise<CheckResult<E | string>>;
    protected pushRule(rule: RuleType<ValueType, DataType, E | string>): void;
    addRule(onValid: ValidCallbackType<ValueType, DataType, E | string>, errorMessage?: E | string | (() => E | string), priority?: boolean): this;
    addAsyncRule(onValid: AsyncValidCallbackType<ValueType, DataType, E | string>, errorMessage?: E | string, priority?: boolean): this;
    isRequired(errorMessage?: E | string, trim?: boolean): this;
    isRequiredOrEmpty(errorMessage?: E | string, trim?: boolean): this;
    /**
     * Define data verification rules based on conditions.
     * @param condition
     * @example
     *
     * ```js
     * SchemaModel({
     *   option: StringType().isOneOf(['a', 'b', 'other']),
     *   other: StringType().when(schema => {
     *     const { value } = schema.option;
     *     return value === 'other' ? StringType().isRequired('Other required') : StringType();
     *   })
     * });
     * ```
     */
    when(condition: (schemaSpec: SchemaDeclaration<DataType, E>) => MixedType): this;
    /**
     * Check if the value is equal to the value of another field.
     * @example
     *
     * ```js
     * SchemaModel({
     *   password: StringType().isRequired(),
     *   confirmPassword: StringType().equalTo('password').isRequired()
     * });
     * ```
     */
    equalTo(fieldName: string, errorMessage?: E | string): this;
    /**
     * After the field verification passes, proxy verification of other fields.
     * @param options.checkIfValueExists When the value of other fields exists, the verification is performed (default: false)
     * @example
     *
     * ```js
     * SchemaModel({
     *   password: StringType().isRequired().proxy(['confirmPassword']),
     *   confirmPassword: StringType().equalTo('password').isRequired()
     * });
     * ```
     */
    proxy(fieldNames: string[], options?: ProxyOptions): this;
    /**
     * Overrides the key name in error messages.
     *
     * @example
     * ```js
     * SchemaModel({
     *  first_name: StringType().label('First name'),
     *  age: NumberType().label('Age')
     * });
     * ```
     */
    label(label: string): this;
}
export default function getMixedType<DataType = any, E = ErrorMessageType>(): MixedType<DataType, E, string, any>;
export {};
