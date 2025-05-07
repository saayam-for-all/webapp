'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PART_SIZE = exports.getUrl = exports.copy = exports.getProperties = exports.list = exports.remove = exports.downloadData = exports.uploadData = void 0;
var apis_1 = require("./apis");
Object.defineProperty(exports, "uploadData", { enumerable: true, get: function () { return apis_1.uploadData; } });
Object.defineProperty(exports, "downloadData", { enumerable: true, get: function () { return apis_1.downloadData; } });
Object.defineProperty(exports, "remove", { enumerable: true, get: function () { return apis_1.remove; } });
Object.defineProperty(exports, "list", { enumerable: true, get: function () { return apis_1.list; } });
Object.defineProperty(exports, "getProperties", { enumerable: true, get: function () { return apis_1.getProperties; } });
Object.defineProperty(exports, "copy", { enumerable: true, get: function () { return apis_1.copy; } });
Object.defineProperty(exports, "getUrl", { enumerable: true, get: function () { return apis_1.getUrl; } });
var constants_1 = require("./utils/constants");
Object.defineProperty(exports, "DEFAULT_PART_SIZE", { enumerable: true, get: function () { return constants_1.DEFAULT_PART_SIZE; } });
//# sourceMappingURL=index.js.map
