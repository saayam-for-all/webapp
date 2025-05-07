import { parseAWSExports } from '../parseAWSExports.mjs';
import { isAmplifyOutputs, parseAmplifyOutputs } from '../parseAmplifyOutputs.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Parses the variety of configuration shapes that Amplify can accept into a ResourcesConfig.
 *
 * @param amplifyConfig An Amplify configuration object conforming to one of the supported schemas.
 * @return A ResourcesConfig for the provided configuration object.
 */
const parseAmplifyConfig = (amplifyConfig) => {
    if (Object.keys(amplifyConfig).some(key => key.startsWith('aws_'))) {
        return parseAWSExports(amplifyConfig);
    }
    else if (isAmplifyOutputs(amplifyConfig)) {
        return parseAmplifyOutputs(amplifyConfig);
    }
    else {
        return amplifyConfig;
    }
};

export { parseAmplifyConfig };
//# sourceMappingURL=parseAmplifyConfig.mjs.map
