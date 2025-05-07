export default CssConverter;
declare class CssConverter {
    constructor(selector: any, pkg: any);
    selector: any;
    pkg: any;
    /**
     * Add `<pkgName>:id/` prefix to beginning of string if it's not there already
     *
     * @param {string} locator The initial locator
     * @returns {string} String with `<pkgName>:id/` prepended (if it wasn't already)
     */
    formatIdLocator(locator: string): string;
    /**
     * Convert a CSS attribute into a UiSelector method call
     *
     * @param {import('css-selector-parser').AstAttribute} cssAttr CSS attribute object
     * @returns {string} CSS attribute parsed as UiSelector
     */
    parseAttr(cssAttr: import("css-selector-parser").AstAttribute): string;
    /**
     * Convert a CSS pseudo class to a UiSelector
     *
     * @param {import('css-selector-parser').AstPseudoClass} cssPseudo CSS Pseudo class
     * @returns {string|null|undefined} Pseudo selector parsed as UiSelector
     */
    parsePseudo(cssPseudo: import("css-selector-parser").AstPseudoClass): string | null | undefined;
    /**
     * Convert a CSS rule to a UiSelector
     * @param {import('css-selector-parser').AstRule} cssRule CSS rule definition
     */
    parseCssRule(cssRule: import("css-selector-parser").AstRule): string;
    /**
     * Convert CSS object to UiAutomator2 selector
     * @param {import('css-selector-parser').AstSelector} css CSS object
     * @returns {string} The CSS object parsed as a UiSelector
     */
    parseCssObject(css: import("css-selector-parser").AstSelector): string;
    /**
     * Convert a CSS selector to a UiAutomator2 selector
     *
     * @returns {string} The CSS selector converted to a UiSelector
     */
    toUiAutomatorSelector(): string;
}
//# sourceMappingURL=css-converter.d.ts.map