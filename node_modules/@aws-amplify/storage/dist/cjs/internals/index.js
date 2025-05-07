'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorMap = exports.StorageValidationErrorCode = exports.assertValidationError = exports.listPaths = exports.copy = exports.downloadData = exports.uploadData = exports.remove = exports.getUrl = exports.getProperties = exports.list = exports.listCallerAccessGrants = exports.getDataAccess = void 0;
var getDataAccess_1 = require("./apis/getDataAccess");
Object.defineProperty(exports, "getDataAccess", { enumerable: true, get: function () { return getDataAccess_1.getDataAccess; } });
var listCallerAccessGrants_1 = require("./apis/listCallerAccessGrants");
Object.defineProperty(exports, "listCallerAccessGrants", { enumerable: true, get: function () { return listCallerAccessGrants_1.listCallerAccessGrants; } });
var list_1 = require("./apis/list");
Object.defineProperty(exports, "list", { enumerable: true, get: function () { return list_1.list; } });
var getProperties_1 = require("./apis/getProperties");
Object.defineProperty(exports, "getProperties", { enumerable: true, get: function () { return getProperties_1.getProperties; } });
var getUrl_1 = require("./apis/getUrl");
Object.defineProperty(exports, "getUrl", { enumerable: true, get: function () { return getUrl_1.getUrl; } });
var remove_1 = require("./apis/remove");
Object.defineProperty(exports, "remove", { enumerable: true, get: function () { return remove_1.remove; } });
var uploadData_1 = require("./apis/uploadData");
Object.defineProperty(exports, "uploadData", { enumerable: true, get: function () { return uploadData_1.uploadData; } });
var downloadData_1 = require("./apis/downloadData");
Object.defineProperty(exports, "downloadData", { enumerable: true, get: function () { return downloadData_1.downloadData; } });
var copy_1 = require("./apis/copy");
Object.defineProperty(exports, "copy", { enumerable: true, get: function () { return copy_1.copy; } });
/** Default Auth exports */
var listPaths_1 = require("./apis/listPaths");
Object.defineProperty(exports, "listPaths", { enumerable: true, get: function () { return listPaths_1.listPaths; } });
/**
 * Internal util functions
 */
var assertValidationError_1 = require("../errors/utils/assertValidationError");
Object.defineProperty(exports, "assertValidationError", { enumerable: true, get: function () { return assertValidationError_1.assertValidationError; } });
/**
 * Utility types
 */
var validation_1 = require("../errors/types/validation");
Object.defineProperty(exports, "StorageValidationErrorCode", { enumerable: true, get: function () { return validation_1.StorageValidationErrorCode; } });
Object.defineProperty(exports, "validationErrorMap", { enumerable: true, get: function () { return validation_1.validationErrorMap; } });
//# sourceMappingURL=index.js.map
