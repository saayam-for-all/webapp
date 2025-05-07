"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_CAPS = exports.PREFIXED_APPIUM_OPTS_CAP = exports.APPIUM_VENDOR_PREFIX = void 0;
exports.mergeCaps = mergeCaps;
exports.validateCaps = validateCaps;
exports.isStandardCap = isStandardCap;
exports.stripAppiumPrefixes = stripAppiumPrefixes;
exports.findNonPrefixedCaps = findNonPrefixedCaps;
exports.parseCaps = parseCaps;
exports.processCapabilities = processCapabilities;
exports.promoteAppiumOptionsForObject = promoteAppiumOptionsForObject;
exports.promoteAppiumOptions = promoteAppiumOptions;
const lodash_1 = __importDefault(require("lodash"));
const desired_caps_1 = require("./desired-caps");
const support_1 = require("@appium/support");
const logger_1 = __importDefault(require("./logger"));
const errors_1 = require("../protocol/errors");
exports.APPIUM_VENDOR_PREFIX = 'appium:';
exports.PREFIXED_APPIUM_OPTS_CAP = `${exports.APPIUM_VENDOR_PREFIX}options`;
/**
 * Takes primary caps object and merges it into a secondary caps object.
 *
 * @see https://www.w3.org/TR/webdriver/#dfn-merging-capabilities)
 */
function mergeCaps(primary = {}, secondary = {}) {
    const result = ({
        ...primary,
    });
    for (const [name, value] of Object.entries(secondary)) {
        // Overwriting is not allowed. Primary and secondary must have different properties (w3c rule 4.4)
        if (!lodash_1.default.isUndefined(primary[name])) {
            throw new errors_1.errors.InvalidArgumentError(`property '${name}' should not exist on both primary (${JSON.stringify(primary)}) and secondary (${JSON.stringify(secondary)}) object`);
        }
        result[name] = value;
    }
    return result;
}
/**
 * Validates caps against a set of constraints
 */
function validateCaps(caps, constraints = {}, opts = {}) {
    const { skipPresenceConstraint } = opts;
    if (!lodash_1.default.isPlainObject(caps)) {
        throw new errors_1.errors.InvalidArgumentError(`must be a JSON object`);
    }
    // Remove the 'presence' constraint if we're not checking for it
    constraints = (lodash_1.default.mapValues(constraints, skipPresenceConstraint
        ? /** @param {Constraint} constraint */
            (constraint) => lodash_1.default.omit(constraint, 'presence')
        : /** @param {Constraint} constraint */
            (constraint) => {
                if (constraint.presence === true) {
                    return { ...lodash_1.default.omit(constraint, 'presence'), presence: { allowEmpty: false } };
                }
                return constraint;
            }));
    const validationErrors = desired_caps_1.validator.validate(lodash_1.default.pickBy(caps, support_1.util.hasValue), constraints, {
        fullMessages: false,
    });
    if (validationErrors) {
        const message = [];
        for (const [attribute, reasons] of lodash_1.default.toPairs(validationErrors)) {
            for (const reason of reasons) {
                message.push(`'${attribute}' ${reason}`);
            }
        }
        throw new errors_1.errors.InvalidArgumentError(message.join('; '));
    }
    // Return caps
    return caps;
}
/**
 * Standard, non-prefixed capabilities
 * @see https://www.w3.org/TR/webdriver/#dfn-table-of-standard-capabilities)
 */
exports.STANDARD_CAPS = Object.freeze(new Set(([
    'browserName',
    'browserVersion',
    'platformName',
    'acceptInsecureCerts',
    'pageLoadStrategy',
    'proxy',
    'setWindowRect',
    'timeouts',
    'unhandledPromptBehavior',
    'webSocketUrl',
])));
const STANDARD_CAPS_LOWER = new Set([...exports.STANDARD_CAPS].map((cap) => cap.toLowerCase()));
function isStandardCap(cap) {
    return STANDARD_CAPS_LOWER.has(cap.toLowerCase());
}
/**
 * If the 'appium:' prefix was provided and it's a valid capability, strip out the prefix
 * @see https://www.w3.org/TR/webdriver/#dfn-extension-capabilities
 * @internal
 */
function stripAppiumPrefixes(caps) {
    // split into prefixed and non-prefixed.
    // non-prefixed should be standard caps at this point
    const [prefixedCaps, nonPrefixedCaps] = lodash_1.default.partition(lodash_1.default.keys(caps), (cap) => String(cap).startsWith(exports.APPIUM_VENDOR_PREFIX));
    // initialize this with the k/v pairs of the non-prefixed caps
    const strippedCaps = (lodash_1.default.pick(caps, nonPrefixedCaps));
    const badPrefixedCaps = [];
    // Strip out the 'appium:' prefix
    for (const prefixedCap of prefixedCaps) {
        const strippedCapName = prefixedCap.substring(exports.APPIUM_VENDOR_PREFIX.length);
        // If it's standard capability that was prefixed, add it to an array of incorrectly prefixed capabilities
        if (isStandardCap(strippedCapName)) {
            badPrefixedCaps.push(strippedCapName);
            if (lodash_1.default.isNil(strippedCaps[strippedCapName])) {
                strippedCaps[strippedCapName] = caps[prefixedCap];
            }
            else {
                logger_1.default.warn(`Ignoring capability '${prefixedCap}=${caps[prefixedCap]}' and ` +
                    `using capability '${strippedCapName}=${strippedCaps[strippedCapName]}'`);
            }
        }
        else {
            strippedCaps[strippedCapName] = caps[prefixedCap];
        }
    }
    // If we found standard caps that were incorrectly prefixed, throw an exception (e.g.: don't accept 'appium:platformName', only accept just 'platformName')
    if (badPrefixedCaps.length > 0) {
        logger_1.default.warn(`The capabilities ${JSON.stringify(badPrefixedCaps)} are standard capabilities and do not require "appium:" prefix`);
    }
    return strippedCaps;
}
/**
 * Get an array of all the unprefixed caps that are being used in 'alwaysMatch' and all of the 'firstMatch' object
 */
function findNonPrefixedCaps({ alwaysMatch = {}, firstMatch = [] }) {
    return lodash_1.default.chain([alwaysMatch, ...firstMatch])
        .reduce((unprefixedCaps, caps) => [
        ...unprefixedCaps,
        ...Object.keys(caps).filter((cap) => !cap.includes(':') && !isStandardCap(cap)),
    ], [])
        .uniq()
        .value();
}
/**
 * Parse capabilities
 * @see https://www.w3.org/TR/webdriver/#processing-capabilities
 */
function parseCaps(caps, constraints = {}, shouldValidateCaps = true) {
    // If capabilities request is not an object, return error (#1.1)
    if (!lodash_1.default.isPlainObject(caps)) {
        throw new errors_1.errors.InvalidArgumentError('The capabilities argument was not valid for the following reason(s): "capabilities" must be a JSON object.');
    }
    // Let 'requiredCaps' be property named 'alwaysMatch' from capabilities request (#2)
    // and 'allFirstMatchCaps' be property named 'firstMatch' from capabilities request (#3)
    const { alwaysMatch: requiredCaps = {}, // If 'requiredCaps' is undefined, set it to an empty JSON object (#2.1)
    firstMatch: allFirstMatchCaps = [{}], // If 'firstMatch' is undefined set it to a singleton list with one empty object (#3.1)
     } = caps;
    // Reject 'firstMatch' argument if it's not an array (#3.2)
    if (!lodash_1.default.isArray(allFirstMatchCaps)) {
        throw new errors_1.errors.InvalidArgumentError('The capabilities.firstMatch argument was not valid for the following reason(s): "capabilities.firstMatch" must be a JSON array or undefined');
    }
    // If an empty array as provided, we'll be forgiving and make it an array of one empty object
    // In the future, reject 'firstMatch' argument if its array did not have one or more entries (#3.2)
    if (allFirstMatchCaps.length === 0) {
        logger_1.default.warn(`The firstMatch array in the given capabilities has no entries. Adding an empty entry for now, ` +
            `but it will require one or more entries as W3C spec.`);
        allFirstMatchCaps.push({});
    }
    // Check for non-prefixed, non-standard capabilities and log warnings if they are found
    const nonPrefixedCaps = findNonPrefixedCaps(caps);
    if (!lodash_1.default.isEmpty(nonPrefixedCaps)) {
        throw new errors_1.errors.InvalidArgumentError(`All non-standard capabilities should have a vendor prefix. The following capabilities did not have one: ${nonPrefixedCaps}`);
    }
    // Strip out the 'appium:' prefix from all
    let strippedRequiredCaps = stripAppiumPrefixes(requiredCaps);
    const strippedAllFirstMatchCaps = allFirstMatchCaps.map(stripAppiumPrefixes);
    // Validate the requiredCaps. But don't validate 'presence' because if that constraint fails on 'alwaysMatch' it could still pass on one of the 'firstMatch' keys
    if (shouldValidateCaps) {
        strippedRequiredCaps = validateCaps(strippedRequiredCaps, constraints, {
            skipPresenceConstraint: true,
        });
    }
    // Remove the 'presence' constraint for any keys that are already present in 'requiredCaps'
    // since we know that this constraint has already passed
    const filteredConstraints = lodash_1.default.omitBy(constraints, (_, key) => key in strippedRequiredCaps);
    // Validate all of the first match capabilities and return an array with only the valid caps (see spec #5)
    const validationErrors = [];
    const validatedFirstMatchCaps = lodash_1.default.compact(strippedAllFirstMatchCaps.map((firstMatchCaps) => {
        try {
            // Validate firstMatch caps
            return shouldValidateCaps
                ? validateCaps(firstMatchCaps, filteredConstraints)
                : firstMatchCaps;
        }
        catch (e) {
            validationErrors.push(e.message);
        }
    }));
    /**
     * Try to merge requiredCaps with first match capabilities, break once it finds its first match
     * (see spec #6)
     */
    let matchedCaps = null;
    for (const firstMatchCaps of validatedFirstMatchCaps) {
        try {
            matchedCaps = mergeCaps(strippedRequiredCaps, firstMatchCaps);
            if (matchedCaps) {
                break;
            }
        }
        catch (err) {
            logger_1.default.warn(err.message);
            validationErrors.push(err.message);
        }
    }
    // Returns variables for testing purposes
    return {
        requiredCaps,
        allFirstMatchCaps,
        validatedFirstMatchCaps,
        matchedCaps,
        validationErrors,
    };
}
/**
 * Calls parseCaps and just returns the matchedCaps variable
 */
function processCapabilities(w3cCaps, constraints = {}, shouldValidateCaps = true) {
    const { matchedCaps, validationErrors } = parseCaps(w3cCaps, constraints, shouldValidateCaps);
    // If we found an error throw an exception
    if (!support_1.util.hasValue(matchedCaps)) {
        if (lodash_1.default.isArray(w3cCaps.firstMatch) && w3cCaps.firstMatch.length > 1) {
            // If there was more than one 'firstMatch' cap, indicate that we couldn't find a matching capabilities set and show all the errors
            throw new errors_1.errors.InvalidArgumentError(`Could not find matching capabilities from ${JSON.stringify(w3cCaps)}:\n ${validationErrors.join('\n')}`);
        }
        else {
            // Otherwise, just show the singular error message
            throw new errors_1.errors.InvalidArgumentError(validationErrors[0]);
        }
    }
    return (matchedCaps ?? {});
}
/**
 * Return a copy of a "bare" (single-level, non-W3C) capabilities object which has taken everything
 * within the 'appium:options' capability and promoted it to the top level.
 */
function promoteAppiumOptionsForObject(obj) {
    const appiumOptions = obj[exports.PREFIXED_APPIUM_OPTS_CAP];
    if (!appiumOptions) {
        return obj;
    }
    if (!lodash_1.default.isPlainObject(appiumOptions)) {
        throw new errors_1.errors.SessionNotCreatedError(`The ${exports.PREFIXED_APPIUM_OPTS_CAP} capability must be an object`);
    }
    if (lodash_1.default.isEmpty(appiumOptions)) {
        return obj;
    }
    logger_1.default.debug(`Found ${exports.PREFIXED_APPIUM_OPTS_CAP} capability present; will promote items inside to caps`);
    /**
     * @param {string} capName
     */
    const shouldAddVendorPrefix = (capName) => !capName.startsWith(exports.APPIUM_VENDOR_PREFIX);
    const verifyIfAcceptable = (capName) => {
        if (!lodash_1.default.isString(capName)) {
            throw new errors_1.errors.SessionNotCreatedError(`Capability names in ${exports.PREFIXED_APPIUM_OPTS_CAP} must be strings. '${capName}' is unexpected`);
        }
        if (isStandardCap(capName)) {
            throw new errors_1.errors.SessionNotCreatedError(`${exports.PREFIXED_APPIUM_OPTS_CAP} must only contain vendor-specific capabilties. '${capName}' is unexpected`);
        }
        return capName;
    };
    const preprocessedOptions = (0, lodash_1.default)(appiumOptions)
        .mapKeys((value, key) => verifyIfAcceptable(key))
        .mapKeys((value, key) => (shouldAddVendorPrefix(key) ? `${exports.APPIUM_VENDOR_PREFIX}${key}` : key))
        .value();
    // warn if we are going to overwrite any keys on the base caps object
    const overwrittenKeys = lodash_1.default.intersection(Object.keys(obj), Object.keys(preprocessedOptions));
    if (overwrittenKeys.length > 0) {
        logger_1.default.warn(`Found capabilities inside ${exports.PREFIXED_APPIUM_OPTS_CAP} that will overwrite ` +
            `capabilities at the top level: ${JSON.stringify(overwrittenKeys)}`);
    }
    return lodash_1.default.cloneDeep({
        ...lodash_1.default.omit(obj, exports.PREFIXED_APPIUM_OPTS_CAP),
        ...preprocessedOptions,
    });
}
/**
 * Return a copy of a capabilities object which has taken everything within the 'options'
 * capability and promoted it to the top level.
 */
function promoteAppiumOptions(originalCaps) {
    const result = {};
    const { alwaysMatch, firstMatch } = originalCaps;
    if (lodash_1.default.isPlainObject(alwaysMatch)) {
        result.alwaysMatch = promoteAppiumOptionsForObject(alwaysMatch);
    }
    else if ('alwaysMatch' in originalCaps) {
        result.alwaysMatch = alwaysMatch;
    }
    if (lodash_1.default.isArray(firstMatch)) {
        result.firstMatch = firstMatch.map(promoteAppiumOptionsForObject);
    }
    else if ('firstMatch' in originalCaps) {
        result.firstMatch = firstMatch;
    }
    return result;
}
//# sourceMappingURL=capabilities.js.map