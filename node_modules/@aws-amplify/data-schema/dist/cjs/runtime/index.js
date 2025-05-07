'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_USER_AGENT_OVERRIDE = exports.addSchemaToClientWithInstance = exports.addSchemaToClient = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./client"), exports);
var addSchemaToClient_1 = require("./addSchemaToClient");
Object.defineProperty(exports, "addSchemaToClient", { enumerable: true, get: function () { return addSchemaToClient_1.addSchemaToClient; } });
var addSchemaToClientWithInstance_1 = require("./addSchemaToClientWithInstance");
Object.defineProperty(exports, "addSchemaToClientWithInstance", { enumerable: true, get: function () { return addSchemaToClientWithInstance_1.addSchemaToClientWithInstance; } });
var getCustomUserAgentDetails_1 = require("./internals/ai/getCustomUserAgentDetails");
Object.defineProperty(exports, "INTERNAL_USER_AGENT_OVERRIDE", { enumerable: true, get: function () { return getCustomUserAgentDetails_1.INTERNAL_USER_AGENT_OVERRIDE; } });
//# sourceMappingURL=index.js.map
