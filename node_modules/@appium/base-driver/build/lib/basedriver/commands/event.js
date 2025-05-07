"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const mixin_1 = require("./mixin");
const EventCommands = {
    /**
     * Log a user-defined event in the event log.
     *
     * @param vendor - a vendor prefix for the user, to ensure namespace
     * separation
     * @param event - the event name
     */
    async logCustomEvent(vendor, event) {
        this.logEvent(`${vendor}:${event}`);
    },
    /**
     * Get the event log
     * @param type - the event type to filter with.
     * It returns all events if the type is not provided or empty string/array.
     * @returns the event history log object
     */
    async getLogEvents(type) {
        if (lodash_1.default.isEmpty(type)) {
            return this.eventHistory;
        }
        const typeList = lodash_1.default.castArray(type);
        return lodash_1.default.reduce(this.eventHistory, (acc, eventTimes, eventType) => {
            if (typeList.includes(eventType)) {
                acc[eventType] = eventTimes;
            }
            return acc;
        }, {});
    },
};
(0, mixin_1.mixin)(EventCommands);
//# sourceMappingURL=event.js.map