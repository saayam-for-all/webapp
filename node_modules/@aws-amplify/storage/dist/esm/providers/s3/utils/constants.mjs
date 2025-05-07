// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const LOCAL_TESTING_S3_ENDPOINT = 'http://localhost:20005';
const DEFAULT_ACCESS_LEVEL = 'guest';
const DEFAULT_PRESIGN_EXPIRATION = 900;
const MAX_URL_EXPIRATION = 7 * 24 * 60 * 60 * 1000;
const MiB = 1024 * 1024;
const GiB = 1024 * MiB;
const TiB = 1024 * GiB;
/**
 * Default part size in MB that is used to determine if an upload task is single part or multi part.
 */
const DEFAULT_PART_SIZE = 5 * MiB;
const MAX_OBJECT_SIZE = 5 * TiB;
const MAX_PARTS_COUNT = 10000;
const DEFAULT_QUEUE_SIZE = 4;
const UPLOADS_STORAGE_KEY = '__uploadInProgress';
const STORAGE_INPUT_PREFIX = 'prefix';
const STORAGE_INPUT_KEY = 'key';
const STORAGE_INPUT_PATH = 'path';
const DEFAULT_DELIMITER = '/';
const CHECKSUM_ALGORITHM_CRC32 = 'crc-32';

export { CHECKSUM_ALGORITHM_CRC32, DEFAULT_ACCESS_LEVEL, DEFAULT_DELIMITER, DEFAULT_PART_SIZE, DEFAULT_PRESIGN_EXPIRATION, DEFAULT_QUEUE_SIZE, LOCAL_TESTING_S3_ENDPOINT, MAX_OBJECT_SIZE, MAX_PARTS_COUNT, MAX_URL_EXPIRATION, STORAGE_INPUT_KEY, STORAGE_INPUT_PATH, STORAGE_INPUT_PREFIX, UPLOADS_STORAGE_KEY };
//# sourceMappingURL=constants.mjs.map
