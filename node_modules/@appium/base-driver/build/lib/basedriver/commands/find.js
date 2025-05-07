"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = require("../../protocol");
const mixin_1 = require("./mixin");
async function findElOrEls(strategy, selector, mult, context) {
    throw new protocol_1.errors.NotImplementedError('Not implemented yet for find.');
}
async function findElOrElsWithProcessing(strategy, selector, mult, context) {
    this.validateLocatorStrategy(strategy);
    try {
        // @ts-expect-error TS does not understand how to deal with the overload here
        return await this.findElOrEls(strategy, selector, mult, context);
    }
    catch (err) {
        if (this.opts.printPageSourceOnFindFailure) {
            const src = await this.getPageSource();
            this.log.debug(`Error finding element${mult ? 's' : ''}: ${err.message}`);
            this.log.debug(`Page source requested through 'printPageSourceOnFindFailure':`);
            this.log.debug(src);
        }
        // still want the error to occur
        throw err;
    }
}
const FindCommands = {
    async findElement(strategy, selector) {
        return await this.findElOrElsWithProcessing(strategy, selector, false);
    },
    async findElements(strategy, selector) {
        return await this.findElOrElsWithProcessing(strategy, selector, true);
    },
    async findElementFromElement(strategy, selector, elementId) {
        return await this.findElOrElsWithProcessing(strategy, selector, false, elementId);
    },
    async findElementsFromElement(strategy, selector, elementId) {
        return await this.findElOrElsWithProcessing(strategy, selector, true, elementId);
    },
    findElOrEls,
    async getPageSource() {
        throw new protocol_1.errors.NotImplementedError('Not implemented yet for find.');
    },
    findElOrElsWithProcessing,
};
(0, mixin_1.mixin)(FindCommands);
//# sourceMappingURL=find.js.map