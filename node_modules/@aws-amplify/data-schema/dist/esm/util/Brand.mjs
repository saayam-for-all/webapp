const brandSymbol = Symbol('brand');
/**
 * Create an object of a specific type Brand
 * string branded type.
 *
 * @param brand: The string to Brand onto a simple object
 * @returns A branded empty object
 *
 * @example
 * brand('example') => {[brandSymbol]: 'example'}
 *
 * Which I might use like this:
 * const myType = {content: "default content", ...brand<'example'>}
 */
function brand(brand) {
    return {
        [brandSymbol]: brand,
    };
}
/**
 *
 * @param branded: Branded object
 * @returns The string brand value
 */
function getBrand(branded) {
    return branded[brandSymbol];
}

export { brand, brandSymbol, getBrand };
//# sourceMappingURL=Brand.mjs.map
