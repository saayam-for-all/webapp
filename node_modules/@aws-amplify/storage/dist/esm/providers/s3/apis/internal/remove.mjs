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
import '../../utils/client/s3data/headObject.mjs';
import { deleteObject } from '../../utils/client/s3data/deleteObject.mjs';
import { getStorageUserAgentValue } from '../../utils/userAgent.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const remove = async (amplify, input) => {
    const { s3Config, keyPrefix, bucket, identityId } = await resolveS3ConfigAndInput(amplify, input);
    const { inputType, objectKey } = validateStorageOperationInput(input, identityId);
    validateBucketOwnerID(input.options?.expectedBucketOwner);
    let finalKey;
    if (inputType === STORAGE_INPUT_KEY) {
        finalKey = `${keyPrefix}${objectKey}`;
        logger.debug(`remove "${objectKey}" from "${finalKey}".`);
    }
    else {
        finalKey = objectKey;
        logger.debug(`removing object in path "${finalKey}"`);
    }
    await deleteObject({
        ...s3Config,
        userAgentValue: getStorageUserAgentValue(StorageAction.Remove),
    }, {
        Bucket: bucket,
        Key: finalKey,
        ExpectedBucketOwner: input.options?.expectedBucketOwner,
    });
    return inputType === STORAGE_INPUT_KEY
        ? {
            key: objectKey,
        }
        : {
            path: objectKey,
        };
};

export { remove };
//# sourceMappingURL=remove.mjs.map
