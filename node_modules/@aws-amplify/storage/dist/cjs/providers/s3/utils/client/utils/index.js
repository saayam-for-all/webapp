'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.bothNilOrEqual = exports.createRetryDecider = exports.validateS3RequiredParameter = exports.serializePathnameObjectKey = exports.serializeObjectConfigsToHeaders = exports.assignStringVariables = exports.map = exports.emptyArrayGuard = exports.deserializeTimestamp = exports.deserializeNumber = exports.deserializeMetadata = exports.deserializeCompletedPartList = exports.deserializeBoolean = exports.buildStorageServiceError = exports.toBase64 = exports.CONTENT_SHA256_HEADER = exports.CANCELED_ERROR_MESSAGE = exports.s3TransferHandler = exports.SEND_UPLOAD_PROGRESS_EVENT = exports.SEND_DOWNLOAD_PROGRESS_EVENT = exports.createXmlErrorParser = exports.parseXmlBody = void 0;
var parsePayload_1 = require("./parsePayload");
Object.defineProperty(exports, "parseXmlBody", { enumerable: true, get: function () { return parsePayload_1.parseXmlBody; } });
Object.defineProperty(exports, "createXmlErrorParser", { enumerable: true, get: function () { return parsePayload_1.createXmlErrorParser; } });
var runtime_1 = require("../runtime");
Object.defineProperty(exports, "SEND_DOWNLOAD_PROGRESS_EVENT", { enumerable: true, get: function () { return runtime_1.SEND_DOWNLOAD_PROGRESS_EVENT; } });
Object.defineProperty(exports, "SEND_UPLOAD_PROGRESS_EVENT", { enumerable: true, get: function () { return runtime_1.SEND_UPLOAD_PROGRESS_EVENT; } });
Object.defineProperty(exports, "s3TransferHandler", { enumerable: true, get: function () { return runtime_1.s3TransferHandler; } });
Object.defineProperty(exports, "CANCELED_ERROR_MESSAGE", { enumerable: true, get: function () { return runtime_1.CANCELED_ERROR_MESSAGE; } });
Object.defineProperty(exports, "CONTENT_SHA256_HEADER", { enumerable: true, get: function () { return runtime_1.CONTENT_SHA256_HEADER; } });
Object.defineProperty(exports, "toBase64", { enumerable: true, get: function () { return runtime_1.toBase64; } });
var deserializeHelpers_1 = require("./deserializeHelpers");
Object.defineProperty(exports, "buildStorageServiceError", { enumerable: true, get: function () { return deserializeHelpers_1.buildStorageServiceError; } });
Object.defineProperty(exports, "deserializeBoolean", { enumerable: true, get: function () { return deserializeHelpers_1.deserializeBoolean; } });
Object.defineProperty(exports, "deserializeCompletedPartList", { enumerable: true, get: function () { return deserializeHelpers_1.deserializeCompletedPartList; } });
Object.defineProperty(exports, "deserializeMetadata", { enumerable: true, get: function () { return deserializeHelpers_1.deserializeMetadata; } });
Object.defineProperty(exports, "deserializeNumber", { enumerable: true, get: function () { return deserializeHelpers_1.deserializeNumber; } });
Object.defineProperty(exports, "deserializeTimestamp", { enumerable: true, get: function () { return deserializeHelpers_1.deserializeTimestamp; } });
Object.defineProperty(exports, "emptyArrayGuard", { enumerable: true, get: function () { return deserializeHelpers_1.emptyArrayGuard; } });
Object.defineProperty(exports, "map", { enumerable: true, get: function () { return deserializeHelpers_1.map; } });
var serializeHelpers_1 = require("./serializeHelpers");
Object.defineProperty(exports, "assignStringVariables", { enumerable: true, get: function () { return serializeHelpers_1.assignStringVariables; } });
Object.defineProperty(exports, "serializeObjectConfigsToHeaders", { enumerable: true, get: function () { return serializeHelpers_1.serializeObjectConfigsToHeaders; } });
Object.defineProperty(exports, "serializePathnameObjectKey", { enumerable: true, get: function () { return serializeHelpers_1.serializePathnameObjectKey; } });
Object.defineProperty(exports, "validateS3RequiredParameter", { enumerable: true, get: function () { return serializeHelpers_1.validateS3RequiredParameter; } });
var createRetryDecider_1 = require("./createRetryDecider");
Object.defineProperty(exports, "createRetryDecider", { enumerable: true, get: function () { return createRetryDecider_1.createRetryDecider; } });
var integrityHelpers_1 = require("./integrityHelpers");
Object.defineProperty(exports, "bothNilOrEqual", { enumerable: true, get: function () { return integrityHelpers_1.bothNilOrEqual; } });
//# sourceMappingURL=index.js.map
