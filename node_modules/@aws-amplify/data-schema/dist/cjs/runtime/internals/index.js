'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeClientCancellation = exports.isConfigureEventWithResourceConfig = exports.isApiGraphQLConfig = exports.isGraphQLResponseWithErrors = exports.generateModelsProperty = exports.generateEnumsProperty = exports.generateGenerationsProperty = exports.generateConversationsProperty = exports.generateCustomSubscriptionsProperty = exports.generateCustomQueriesProperty = exports.generateCustomMutationsProperty = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var generateCustomOperationsProperty_1 = require("./generateCustomOperationsProperty");
Object.defineProperty(exports, "generateCustomMutationsProperty", { enumerable: true, get: function () { return generateCustomOperationsProperty_1.generateCustomMutationsProperty; } });
Object.defineProperty(exports, "generateCustomQueriesProperty", { enumerable: true, get: function () { return generateCustomOperationsProperty_1.generateCustomQueriesProperty; } });
Object.defineProperty(exports, "generateCustomSubscriptionsProperty", { enumerable: true, get: function () { return generateCustomOperationsProperty_1.generateCustomSubscriptionsProperty; } });
var generateConversationsProperty_1 = require("./utils/clientProperties/generateConversationsProperty");
Object.defineProperty(exports, "generateConversationsProperty", { enumerable: true, get: function () { return generateConversationsProperty_1.generateConversationsProperty; } });
var generateGenerationsProperty_1 = require("./utils/clientProperties/generateGenerationsProperty");
Object.defineProperty(exports, "generateGenerationsProperty", { enumerable: true, get: function () { return generateGenerationsProperty_1.generateGenerationsProperty; } });
var generateEnumsProperty_1 = require("./utils/clientProperties/generateEnumsProperty");
Object.defineProperty(exports, "generateEnumsProperty", { enumerable: true, get: function () { return generateEnumsProperty_1.generateEnumsProperty; } });
var generateModelsProperty_1 = require("./utils/clientProperties/generateModelsProperty");
Object.defineProperty(exports, "generateModelsProperty", { enumerable: true, get: function () { return generateModelsProperty_1.generateModelsProperty; } });
var isGraphQLResponseWithErrors_1 = require("./utils/runtimeTypeGuards/isGraphQLResponseWithErrors");
Object.defineProperty(exports, "isGraphQLResponseWithErrors", { enumerable: true, get: function () { return isGraphQLResponseWithErrors_1.isGraphQLResponseWithErrors; } });
var isApiGraphQLProviderConfig_1 = require("./utils/runtimeTypeGuards/isApiGraphQLProviderConfig");
Object.defineProperty(exports, "isApiGraphQLConfig", { enumerable: true, get: function () { return isApiGraphQLProviderConfig_1.isApiGraphQLConfig; } });
var isConfigureEventWithResourceConfig_1 = require("./utils/runtimeTypeGuards/isConfigureEventWithResourceConfig");
Object.defineProperty(exports, "isConfigureEventWithResourceConfig", { enumerable: true, get: function () { return isConfigureEventWithResourceConfig_1.isConfigureEventWithResourceConfig; } });
var cancellation_1 = require("./cancellation");
Object.defineProperty(exports, "upgradeClientCancellation", { enumerable: true, get: function () { return cancellation_1.upgradeClientCancellation; } });
//# sourceMappingURL=index.js.map
