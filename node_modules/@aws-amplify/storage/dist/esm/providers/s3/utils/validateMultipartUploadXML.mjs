import { IntegrityError } from '../../../errors/IntegrityError.mjs';
import './client/runtime/s3TransferHandler/fetch.mjs';
import { parser } from './client/runtime/xmlParser/pureJs.mjs';
import './client/runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import '@aws-amplify/core/internals/aws-client-utils';
import { map, emptyArrayGuard, deserializeCompletedPartList } from './client/utils/deserializeHelpers.mjs';
import '@aws-amplify/core/internals/utils';
import { isEqual } from './client/utils/integrityHelpers.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function validateMultipartUploadXML(input, xml) {
    if (!input.Parts) {
        throw new IntegrityError();
    }
    const parsedXML = parser.parse(xml);
    const mappedCompletedMultipartUpload = map(parsedXML, {
        Parts: [
            'Part',
            value => emptyArrayGuard(value, deserializeCompletedPartList),
        ],
    });
    if (!isEqual(input, mappedCompletedMultipartUpload)) {
        throw new IntegrityError();
    }
}

export { validateMultipartUploadXML };
//# sourceMappingURL=validateMultipartUploadXML.mjs.map
