import { StorageAction } from '@aws-amplify/core/internals/utils';
import '@smithy/md5-js';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../utils/client/runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../../utils/client/runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { resolveS3ConfigAndInput } from '../../utils/resolveS3ConfigAndInput.mjs';
import '../../../../errors/types/validation.mjs';
import { logger } from '../../../../utils/logger.mjs';
import { validateBucketOwnerID } from '../../utils/validateBucketOwnerID.mjs';
import { DEFAULT_DELIMITER, STORAGE_INPUT_PREFIX } from '../../utils/constants.mjs';
import { validateStorageOperationInputWithPrefix } from '../../utils/validateStorageOperationInputWithPrefix.mjs';
import { urlDecode } from '../../utils/urlDecoder.mjs';
import '../../utils/client/s3data/base.mjs';
import '../../utils/client/s3data/getObject.mjs';
import { listObjectsV2 } from '../../utils/client/s3data/listObjectsV2.mjs';
import '../../utils/client/s3data/putObject.mjs';
import '../../utils/client/s3data/createMultipartUpload.mjs';
import '../../utils/client/s3data/uploadPart.mjs';
import '../../utils/client/s3data/completeMultipartUpload.mjs';
import '../../utils/client/s3data/listParts.mjs';
import '../../utils/client/s3data/abortMultipartUpload.mjs';
import '../../utils/client/s3data/copyObject.mjs';
import '../../utils/client/s3data/headObject.mjs';
import '../../utils/client/s3data/deleteObject.mjs';
import { getStorageUserAgentValue } from '../../utils/userAgent.mjs';
import { IntegrityError } from '../../../../errors/IntegrityError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const MAX_PAGE_SIZE = 1000;
const list = async (amplify, input) => {
    const { options = {} } = input;
    const { s3Config, bucket, keyPrefix: generatedPrefix, identityId, } = await resolveS3ConfigAndInput(amplify, input);
    const { inputType, objectKey } = validateStorageOperationInputWithPrefix(input, identityId);
    validateBucketOwnerID(options.expectedBucketOwner);
    const isInputWithPrefix = inputType === STORAGE_INPUT_PREFIX;
    // @ts-expect-error pageSize and nextToken should not coexist with listAll
    if (options?.listAll && (options?.pageSize || options?.nextToken)) {
        const anyOptions = options;
        logger.debug(`listAll is set to true, ignoring ${anyOptions?.pageSize ? `pageSize: ${anyOptions?.pageSize}` : ''} ${anyOptions?.nextToken ? `nextToken: ${anyOptions?.nextToken}` : ''}.`);
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
    logger.debug(`listing items from "${listParams.Prefix}"`);
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
        logger.debug(`defaulting pageSize to ${MAX_PAGE_SIZE}.`);
        listParamsClone.MaxKeys = MAX_PAGE_SIZE;
    }
    const response = await listObjectsV2({
        ...s3Config,
        userAgentValue: getStorageUserAgentValue(StorageAction.List),
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
        logger.debug(`defaulting pageSize to ${MAX_PAGE_SIZE}.`);
        listParamsClone.MaxKeys = MAX_PAGE_SIZE;
    }
    const response = await listObjectsV2({
        ...s3Config,
        userAgentValue: getStorageUserAgentValue(StorageAction.List),
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
        return options?.subpathStrategy?.delimiter ?? DEFAULT_DELIMITER;
    }
};
const validateEchoedElements = (listInput, listOutput) => {
    const validEchoedParameters = listInput.Bucket === listOutput.Name &&
        listInput.Delimiter === listOutput.Delimiter &&
        listInput.MaxKeys === listOutput.MaxKeys &&
        listInput.Prefix === listOutput.Prefix &&
        listInput.ContinuationToken === listOutput.ContinuationToken;
    if (!validEchoedParameters) {
        throw new IntegrityError();
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
            decodedListOutput[prop] = urlDecode(value);
        }
    });
    // Decode 'Key' in each item of 'Contents', if it exists
    if (listOutput.Contents) {
        decodedListOutput.Contents = listOutput.Contents.map(content => ({
            ...content,
            Key: content.Key ? urlDecode(content.Key) : content.Key,
        }));
    }
    // Decode 'Prefix' in each item of 'CommonPrefixes', if it exists
    if (listOutput.CommonPrefixes) {
        decodedListOutput.CommonPrefixes = listOutput.CommonPrefixes.map(content => ({
            ...content,
            Prefix: content.Prefix ? urlDecode(content.Prefix) : content.Prefix,
        }));
    }
    return decodedListOutput;
};

export { list };
//# sourceMappingURL=list.mjs.map
