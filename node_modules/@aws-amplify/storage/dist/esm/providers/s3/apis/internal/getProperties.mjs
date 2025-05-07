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
import { validateStorageOperationInput } from '../../utils/validateStorageOperationInput.mjs';
import { STORAGE_INPUT_KEY } from '../../utils/constants.mjs';
import '../../utils/client/s3data/base.mjs';
import '../../utils/client/s3data/getObject.mjs';
import '../../utils/client/s3data/listObjectsV2.mjs';
import '../../utils/client/s3data/putObject.mjs';
import '../../utils/client/s3data/createMultipartUpload.mjs';
import '../../utils/client/s3data/uploadPart.mjs';
import '../../utils/client/s3data/completeMultipartUpload.mjs';
import '../../utils/client/s3data/listParts.mjs';
import '../../utils/client/s3data/abortMultipartUpload.mjs';
import '../../utils/client/s3data/copyObject.mjs';
import { headObject } from '../../utils/client/s3data/headObject.mjs';
import '../../utils/client/s3data/deleteObject.mjs';
import { getStorageUserAgentValue } from '../../utils/userAgent.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getProperties = async (amplify, input, action) => {
    const { s3Config, bucket, keyPrefix, identityId } = await resolveS3ConfigAndInput(amplify, input);
    const { inputType, objectKey } = validateStorageOperationInput(input, identityId);
    validateBucketOwnerID(input.options?.expectedBucketOwner);
    const finalKey = inputType === STORAGE_INPUT_KEY ? keyPrefix + objectKey : objectKey;
    logger.debug(`get properties of ${objectKey} from ${finalKey}`);
    const response = await headObject({
        ...s3Config,
        userAgentValue: getStorageUserAgentValue(action ?? StorageAction.GetProperties),
    }, {
        Bucket: bucket,
        Key: finalKey,
        ExpectedBucketOwner: input.options?.expectedBucketOwner,
    });
    const result = {
        contentType: response.ContentType,
        size: response.ContentLength,
        eTag: response.ETag,
        lastModified: response.LastModified,
        metadata: response.Metadata,
        versionId: response.VersionId,
    };
    return inputType === STORAGE_INPUT_KEY
        ? { key: objectKey, ...result }
        : { path: objectKey, ...result };
};

export { getProperties };
//# sourceMappingURL=getProperties.mjs.map
