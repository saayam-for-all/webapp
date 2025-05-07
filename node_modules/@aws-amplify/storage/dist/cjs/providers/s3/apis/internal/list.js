'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../../utils");
const s3data_1 = require("../../utils/client/s3data");
const userAgent_1 = require("../../utils/userAgent");
const utils_3 = require("../../../../utils");
const constants_1 = require("../../utils/constants");
const IntegrityError_1 = require("../../../../errors/IntegrityError");
const MAX_PAGE_SIZE = 1000;
const list = async (amplify, input) => {
    const { options = {} } = input;
    const { s3Config, bucket, keyPrefix: generatedPrefix, identityId, } = await (0, utils_2.resolveS3ConfigAndInput)(amplify, input);
    const { inputType, objectKey } = (0, utils_2.validateStorageOperationInputWithPrefix)(input, identityId);
    (0, utils_2.validateBucketOwnerID)(options.expectedBucketOwner);
    const isInputWithPrefix = inputType === constants_1.STORAGE_INPUT_PREFIX;
    // @ts-expect-error pageSize and nextToken should not coexist with listAll
    if (options?.listAll && (options?.pageSize || options?.nextToken)) {
        const anyOptions = options;
        utils_3.logger.debug(`listAll is set to true, ignoring ${anyOptions?.pageSize ? `pageSize: ${anyOptions?.pageSize}` : ''} ${anyOptions?.nextToken ? `nextToken: ${anyOptions?.nextToken}` : ''}.`);
    }
    const listParams = {
        Bucket: bucket,
        Prefix: isInputWithPrefix ? `${generatedPrefix}${objectKey}` : objectKey,
        MaxKeys: options?.listAll ? undefined : options?.pageSize,
        ContinuationToken: options?.listAll ? undefined : options?.nextToken,
        Delimiter: getDelimiter(options),
        ExpectedBucketOwner: options?.expectedBucketOwner,
        EncodingType: 'url',
    };
    utils_3.logger.debug(`listing items from "${listParams.Prefix}"`);
    const listInputArgs = {
        s3Config,
        listParams,
    };
    if (options.listAll) {
        if (isInputWithPrefix) {
            return _listAllWithPrefix({
                ...listInputArgs,
                generatedPrefix,
            });
        }
        else {
            return _listAllWithPath(listInputArgs);
        }
    }
    else {
        if (isInputWithPrefix) {
            return _listWithPrefix({ ...listInputArgs, generatedPrefix });
        }
        else {
            return _listWithPath(listInputArgs);
        }
    }
};
exports.list = list;
/** @deprecated Use {@link _listAllWithPath} instead. */
const _listAllWithPrefix = async ({ s3Config, listParams, generatedPrefix, }) => {
    const listResult = [];
    let continuationToken = listParams.ContinuationToken;
    do {
        const { items: pageResults, nextToken: pageNextToken } = await _listWithPrefix({
            generatedPrefix,
            s3Config,
            listParams: {
                ...listParams,
                ContinuationToken: continuationToken,
                MaxKeys: MAX_PAGE_SIZE,
            },
        });
        listResult.push(...pageResults);
        continuationToken = pageNextToken;
    } while (continuationToken);
    return {
        items: listResult,
    };
};
/** @deprecated Use {@link _listWithPath} instead. */
const _listWithPrefix = async ({ s3Config, listParams, generatedPrefix, }) => {
    const listParamsClone = { ...listParams };
    if (!listParamsClone.MaxKeys || listParamsClone.MaxKeys > MAX_PAGE_SIZE) {
        utils_3.logger.debug(`defaulting pageSize to ${MAX_PAGE_SIZE}.`);
        listParamsClone.MaxKeys = MAX_PAGE_SIZE;
    }
    const response = await (0, s3data_1.listObjectsV2)({
        ...s3Config,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.List),
    }, listParamsClone);
    const listOutput = decodeEncodedElements(response);
    validateEchoedElements(listParamsClone, listOutput);
    if (!listOutput?.Contents) {
        return {
            items: [],
        };
    }
    return {
        items: listOutput.Contents.map(item => ({
            key: generatedPrefix
                ? item.Key.substring(generatedPrefix.length)
                : item.Key,
            eTag: item.ETag,
            lastModified: item.LastModified,
            size: item.Size,
        })),
        nextToken: listOutput.NextContinuationToken,
    };
};
const _listAllWithPath = async ({ s3Config, listParams, }) => {
    const listResult = [];
    const excludedSubpaths = [];
    let continuationToken = listParams.ContinuationToken;
    do {
        const { items: pageResults, excludedSubpaths: pageExcludedSubpaths, nextToken: pageNextToken, } = await _listWithPath({
            s3Config,
            listParams: {
                ...listParams,
                ContinuationToken: continuationToken,
                MaxKeys: MAX_PAGE_SIZE,
            },
        });
        listResult.push(...pageResults);
        excludedSubpaths.push(...(pageExcludedSubpaths ?? []));
        continuationToken = pageNextToken;
    } while (continuationToken);
    return {
        items: listResult,
        excludedSubpaths,
    };
};
const _listWithPath = async ({ s3Config, listParams, }) => {
    const listParamsClone = { ...listParams };
    if (!listParamsClone.MaxKeys || listParamsClone.MaxKeys > MAX_PAGE_SIZE) {
        utils_3.logger.debug(`defaulting pageSize to ${MAX_PAGE_SIZE}.`);
        listParamsClone.MaxKeys = MAX_PAGE_SIZE;
    }
    const response = await (0, s3data_1.listObjectsV2)({
        ...s3Config,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.List),
    }, listParamsClone);
    const listOutput = decodeEncodedElements(response);
    validateEchoedElements(listParamsClone, listOutput);
    const { Contents: contents, NextContinuationToken: nextContinuationToken, CommonPrefixes: commonPrefixes, } = listOutput;
    const excludedSubpaths = commonPrefixes && mapCommonPrefixesToExcludedSubpaths(commonPrefixes);
    if (!contents) {
        return {
            items: [],
            nextToken: nextContinuationToken,
            excludedSubpaths,
        };
    }
    return {
        items: contents.map(item => ({
            path: item.Key,
            eTag: item.ETag,
            lastModified: item.LastModified,
            size: item.Size,
        })),
        nextToken: nextContinuationToken,
        excludedSubpaths,
    };
};
const mapCommonPrefixesToExcludedSubpaths = (commonPrefixes) => {
    return commonPrefixes.reduce((mappedSubpaths, { Prefix }) => {
        if (Prefix) {
            mappedSubpaths.push(Prefix);
        }
        return mappedSubpaths;
    }, []);
};
const getDelimiter = (options) => {
    if (options?.subpathStrategy?.strategy === 'exclude') {
        return options?.subpathStrategy?.delimiter ?? constants_1.DEFAULT_DELIMITER;
    }
};
const validateEchoedElements = (listInput, listOutput) => {
    const validEchoedParameters = listInput.Bucket === listOutput.Name &&
        listInput.Delimiter === listOutput.Delimiter &&
        listInput.MaxKeys === listOutput.MaxKeys &&
        listInput.Prefix === listOutput.Prefix &&
        listInput.ContinuationToken === listOutput.ContinuationToken;
    if (!validEchoedParameters) {
        throw new IntegrityError_1.IntegrityError();
    }
};
/**
 * Decodes URL-encoded elements in the S3 `ListObjectsV2Output` response when `EncodingType` is `'url'`.
 * Applies to values for 'Delimiter', 'Prefix', 'StartAfter' and 'Key' in the response.
 */
const decodeEncodedElements = (listOutput) => {
    if (listOutput.EncodingType !== 'url') {
        return listOutput;
    }
    const decodedListOutput = { ...listOutput };
    // Decode top-level properties
    ['Delimiter', 'Prefix', 'StartAfter'].forEach(prop => {
        const value = listOutput[prop];
        if (typeof value === 'string') {
            decodedListOutput[prop] = (0, utils_2.urlDecode)(value);
        }
    });
    // Decode 'Key' in each item of 'Contents', if it exists
    if (listOutput.Contents) {
        decodedListOutput.Contents = listOutput.Contents.map(content => ({
            ...content,
            Key: content.Key ? (0, utils_2.urlDecode)(content.Key) : content.Key,
        }));
    }
    // Decode 'Prefix' in each item of 'CommonPrefixes', if it exists
    if (listOutput.CommonPrefixes) {
        decodedListOutput.CommonPrefixes = listOutput.CommonPrefixes.map(content => ({
            ...content,
            Prefix: content.Prefix ? (0, utils_2.urlDecode)(content.Prefix) : content.Prefix,
        }));
    }
    return decodedListOutput;
};
//# sourceMappingURL=list.js.map
