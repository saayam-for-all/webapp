'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAmplifyConfig = void 0;
const parseAWSExports_1 = require("../parseAWSExports");
const parseAmplifyOutputs_1 = require("../parseAmplifyOutputs");
/**
 * Parses the variety of configuration shapes that Amplify can accept into a ResourcesConfig.
 *
 * @param amplifyConfig An Amplify configuration object conforming to one of the supported schemas.
 * @return A ResourcesConfig for the provided configuration object.
 */
const parseAmplifyConfig = (amplifyConfig) => {
    if (Object.keys(amplifyConfig).some(key => key.startsWith('aws_'))) {
        return (0, parseAWSExports_1.parseAWSExports)(amplifyConfig);
    }
    else if ((0, parseAmplifyOutputs_1.isAmplifyOutputs)(amplifyConfig)) {
        return (0, parseAmplifyOutputs_1.parseAmplifyOutputs)(amplifyConfig);
    }
    else {
        return amplifyConfig;
    }
};
exports.parseAmplifyConfig = parseAmplifyConfig;
//# sourceMappingURL=parseAmplifyConfig.js.map
