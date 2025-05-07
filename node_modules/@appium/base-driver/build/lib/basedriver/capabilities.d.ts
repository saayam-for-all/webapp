import type { Constraints, NSCapabilities, Capabilities, W3CCapabilities, StandardCapabilities } from '@appium/types';
import type { MergeExclusive } from 'type-fest';
export declare const APPIUM_VENDOR_PREFIX = "appium:";
export declare const PREFIXED_APPIUM_OPTS_CAP = "appium:options";
export type ParsedCaps<C extends Constraints> = {
    allFirstMatchCaps: NSCapabilities<C>[];
    validatedFirstMatchCaps: Capabilities<C>[];
    requiredCaps: NSCapabilities<C>;
    matchedCaps: Capabilities<C> | null;
    validationErrors: string[];
};
export type ValidateCapsOpts = {
    /** if true, skip the presence constraint */
    skipPresenceConstraint?: boolean | undefined;
};
/**
 * Takes primary caps object and merges it into a secondary caps object.
 *
 * @see https://www.w3.org/TR/webdriver/#dfn-merging-capabilities)
 */
export declare function mergeCaps<T extends Constraints, U extends Constraints, Primary extends Capabilities<T>, Secondary extends Capabilities<U>>(primary?: Primary | undefined, secondary?: Secondary | undefined): MergeExclusive<Primary, Secondary>;
/**
 * Validates caps against a set of constraints
 */
export declare function validateCaps<C extends Constraints>(caps: Capabilities<C>, constraints?: C | undefined, opts?: ValidateCapsOpts | undefined): Capabilities<C>;
/**
 * Standard, non-prefixed capabilities
 * @see https://www.w3.org/TR/webdriver/#dfn-table-of-standard-capabilities)
 */
export declare const STANDARD_CAPS: Readonly<Set<keyof StandardCapabilities>>;
export declare function isStandardCap(cap: string): boolean;
/**
 * Get an array of all the unprefixed caps that are being used in 'alwaysMatch' and all of the 'firstMatch' object
 */
export declare function findNonPrefixedCaps<C extends Constraints>({ alwaysMatch, firstMatch }: W3CCapabilities<C>): string[];
/**
 * Parse capabilities
 * @see https://www.w3.org/TR/webdriver/#processing-capabilities
 */
export declare function parseCaps<C extends Constraints>(caps: W3CCapabilities<C>, constraints?: C | undefined, shouldValidateCaps?: boolean | undefined): ParsedCaps<C>;
/**
 * Calls parseCaps and just returns the matchedCaps variable
 */
export declare function processCapabilities<C extends Constraints, W3CCaps extends W3CCapabilities<C>>(w3cCaps: W3CCaps, constraints?: C | undefined, shouldValidateCaps?: boolean | undefined): Capabilities<C>;
/**
 * Return a copy of a "bare" (single-level, non-W3C) capabilities object which has taken everything
 * within the 'appium:options' capability and promoted it to the top level.
 */
export declare function promoteAppiumOptionsForObject<C extends Constraints>(obj: NSCapabilities<C>): NSCapabilities<C>;
/**
 * Return a copy of a capabilities object which has taken everything within the 'options'
 * capability and promoted it to the top level.
 */
export declare function promoteAppiumOptions<C extends Constraints>(originalCaps: W3CCapabilities<C>): W3CCapabilities<C>;
//# sourceMappingURL=capabilities.d.ts.map