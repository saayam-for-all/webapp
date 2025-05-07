'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMultipartUploadXML = void 0;
const IntegrityError_1 = require("../../../errors/IntegrityError");
const runtime_1 = require("./client/runtime");
const utils_1 = require("./client/utils");
const integrityHelpers_1 = require("./client/utils/integrityHelpers");
function validateMultipartUploadXML(input, xml) {
    if (!input.Parts) {
        throw new IntegrityError_1.IntegrityError();
    }
    const parsedXML = runtime_1.parser.parse(xml);
    const mappedCompletedMultipartUpload = (0, utils_1.map)(parsedXML, {
        Parts: [
            'Part',
            value => (0, utils_1.emptyArrayGuard)(value, utils_1.deserializeCompletedPartList),
        ],
    });
    if (!(0, integrityHelpers_1.isEqual)(input, mappedCompletedMultipartUpload)) {
        throw new IntegrityError_1.IntegrityError();
    }
}
exports.validateMultipartUploadXML = validateMultipartUploadXML;
//# sourceMappingURL=validateMultipartUploadXML.js.map
