"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureValuesPreprocessor = void 0;
const lodash_1 = __importDefault(require("lodash"));
const DEFAULT_REPLACER = '**SECURE**';
/**
 * Type guard for log filter type
 * @param {object} value
 * @returns {value is LogFilterRegex}
 */
function isLogFilterRegex(value) {
    return 'pattern' in value;
}
class SecureValuesPreprocessor {
    constructor() {
        this._rules = [];
    }
    /**
     * @returns {Array<SecureValuePreprocessingRule>} The list of successfully
     * parsed preprocessing rules
     */
    get rules() {
        return this._rules;
    }
    /**
     * Parses single rule from the given JSON file
     *
     * @param {string|LogFilter} rule The rule might
     * either be represented as a single string or a configuration object
     * @throws {Error} If there was an error while parsing the rule
     * @returns {SecureValuePreprocessingRule} The parsed rule
     */
    parseRule(rule) {
        let pattern;
        let replacer = DEFAULT_REPLACER;
        let flags = ['g'];
        if (lodash_1.default.isString(rule)) {
            if (rule.length === 0) {
                throw new Error(`${JSON.stringify(rule)} -> The value must not be empty`);
            }
            pattern = `\\b${lodash_1.default.escapeRegExp(rule)}\\b`;
        }
        else if (lodash_1.default.isPlainObject(rule)) {
            if (isLogFilterRegex(rule)) {
                if (!lodash_1.default.isString(rule.pattern) || rule.pattern.length === 0) {
                    throw new Error(`${JSON.stringify(rule)} -> The value of 'pattern' must be a valid non-empty string`);
                }
                pattern = rule.pattern;
            }
            else if (lodash_1.default.has(rule, 'text')) {
                if (!lodash_1.default.isString(rule.text) || rule.text.length === 0) {
                    throw new Error(`${JSON.stringify(rule)} -> The value of 'text' must be a valid non-empty string`);
                }
                pattern = `\\b${lodash_1.default.escapeRegExp(rule.text)}\\b`;
            }
            if (!pattern) {
                throw new Error(`${JSON.stringify(rule)} -> Must either have a field named 'pattern' or 'text'`);
            }
            if (lodash_1.default.has(rule, 'flags')) {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags_2
                for (const flag of ['i', 'g', 'm', 's', 'u', 'y']) {
                    if (lodash_1.default.includes(rule.flags, flag)) {
                        flags.push(flag);
                    }
                }
                flags = lodash_1.default.uniq(flags);
            }
            if (lodash_1.default.isString(rule.replacer)) {
                replacer = rule.replacer;
            }
        }
        else {
            throw new Error(`${JSON.stringify(rule)} -> Must either be a string or an object`);
        }
        return {
            pattern: new RegExp(pattern, flags.join('')),
            replacer,
        };
    }
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
    async loadRules(filters) {
        const issues = [];
        const rawRules = [];
        for (const source of (lodash_1.default.isArray(filters) ? filters : [filters])) {
            if (lodash_1.default.isPlainObject(source)) {
                rawRules.push(source);
            }
            else if (lodash_1.default.isString(source)) {
                rawRules.push(String(source));
            }
            else {
                issues.push(`'${source}' must be a valid log filtering rule`);
            }
        }
        this._rules = [];
        for (const rawRule of rawRules) {
            try {
                this._rules.push(this.parseRule(rawRule));
            }
            catch (e) {
                issues.push(e.message);
            }
        }
        return issues;
    }
    /**
     * Performs secure values replacement inside the given string
     * according to the previously loaded rules. No replacement is made
     * if there are no rules or the given value is not a string
     *
     * @param {string} str The string to make replacements in
     * @returns {string} The string with replacements made
     */
    preprocess(str) {
        if (this._rules.length === 0 || !str || !lodash_1.default.isString(str)) {
            return str;
        }
        let result = str;
        for (const rule of this._rules) {
            result = result.replace(rule.pattern, rule.replacer ?? DEFAULT_REPLACER);
        }
        return result;
    }
}
exports.SecureValuesPreprocessor = SecureValuesPreprocessor;
//# sourceMappingURL=secure-values-preprocessor.js.map