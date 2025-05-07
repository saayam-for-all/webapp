import type { brandSymbol } from './util/Brand.js';
type EnumTypeParamShape<values extends readonly string[] = readonly string[]> = {
    type: 'enum';
    values: values;
};
/**
 * Enum type definition content
 *
 * @param values - The values of the enum
 */
export interface EnumType<values extends readonly string[] = readonly string[]> extends EnumTypeParamShape<values> {
    [brandSymbol]: 'enum';
}
/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
export declare function enumType<const values extends readonly string[]>(values: values): EnumType<values>;
export {};
