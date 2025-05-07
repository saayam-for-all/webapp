"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixin = mixin;
const driver_1 = require("../driver");
/**
 * This function assigns a mixin `T` to the `BaseDriver` class' prototype.
 * While each mixin has its own interface which is (in isolation) unrelated to `BaseDriver`, the constraint
 * on this generic type `T` is that it must be a partial of `BaseDriver`'s interface. This enforces
 * that it does not conflict with the existing interface of `BaseDriver`.  In that way, you can
 * think of it as a type guard.
 * @param mixin Mixin implementation
 */
function mixin(mixin) {
    Object.assign(driver_1.BaseDriver.prototype, mixin);
}
//# sourceMappingURL=mixin.js.map