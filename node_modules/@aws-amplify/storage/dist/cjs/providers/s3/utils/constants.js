'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECKSUM_ALGORITHM_CRC32 = exports.DEFAULT_DELIMITER = exports.STORAGE_INPUT_PATH = exports.STORAGE_INPUT_KEY = exports.STORAGE_INPUT_PREFIX = exports.UPLOADS_STORAGE_KEY = exports.DEFAULT_QUEUE_SIZE = exports.MAX_PARTS_COUNT = exports.MAX_OBJECT_SIZE = exports.DEFAULT_PART_SIZE = exports.MAX_URL_EXPIRATION = exports.DEFAULT_PRESIGN_EXPIRATION = exports.DEFAULT_ACCESS_LEVEL = exports.LOCAL_TESTING_S3_ENDPOINT = void 0;
exports.LOCAL_TESTING_S3_ENDPOINT = 'http://localhost:20005';
exports.DEFAULT_ACCESS_LEVEL = 'guest';
exports.DEFAULT_PRESIGN_EXPIRATION = 900;
exports.MAX_URL_EXPIRATION = 7 * 24 * 60 * 60 * 1000;
const MiB = 1024 * 1024;
const GiB = 1024 * MiB;
const TiB = 1024 * GiB;
/**
 * Default part size in MB that is used to determine if an upload task is single part or multi part.
 */
exports.DEFAULT_PART_SIZE = 5 * MiB;
exports.MAX_OBJECT_SIZE = 5 * TiB;
exports.MAX_PARTS_COUNT = 10000;
exports.DEFAULT_QUEUE_SIZE = 4;
exports.UPLOADS_STORAGE_KEY = '__uploadInProgress';
exports.STORAGE_INPUT_PREFIX = 'prefix';
exports.STORAGE_INPUT_KEY = 'key';
exports.STORAGE_INPUT_PATH = 'path';
exports.DEFAULT_DELIMITER = '/';
exports.CHECKSUM_ALGORITHM_CRC32 = 'crc-32';
//# sourceMappingURL=constants.js.map
