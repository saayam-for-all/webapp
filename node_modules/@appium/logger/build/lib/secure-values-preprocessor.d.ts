import type { SecureValuePreprocessingRule, LogFiltersConfig, LogFilter } from './types';
export declare class SecureValuesPreprocessor {
    _rules: SecureValuePreprocessingRule[];
    constructor();
    /**
     * @returns {Array<SecureValuePreprocessingRule>} The list of successfully
     * parsed preprocessing rules
     */
    get rules(): Array<SecureValuePreprocessingRule>;
    /**
     * Parses single rule from the given JSON file
     *
     * @param {string|LogFilter} rule The rule might
     * either be represented as a single string or a configuration object
     * @throws {Error} If there was an error while parsing the rule
     * @returns {SecureValuePreprocessingRule} The parsed rule
     */
    parseRule(rule: string | LogFilter): SecureValuePreprocessingRule;
    /**
     * Loads rules from the given JSON file
     *
     * @param {string|string[]|LogFiltersConfig} filters
     * One or more log parsing rules
     * @throws {Error} If the format of the source file is invalid or
     * it does not exist
     * @returns {Promise<string[]>} The list of issues found while parsing each rule.
     * An empty list is returned if no rule parsing issues were found
     */
    loadRules(filters: string | string[] | LogFiltersConfig): Promise<string[]>;
    /**
     * Performs secure values replacement inside the given string
     * according to the previously loaded rules. No replacement is made
     * if there are no rules or the given value is not a string
     *
     * @param {string} str The string to make replacements in
     * @returns {string} The string with replacements made
     */
    preprocess(str: string): string;
}
//# sourceMappingURL=secure-values-preprocessor.d.ts.map