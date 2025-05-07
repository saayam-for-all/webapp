'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnumsProperty = void 0;
const generateEnumsProperty = (graphqlConfig) => {
    const modelIntrospection = graphqlConfig.modelIntrospection;
    if (!modelIntrospection) {
        return {};
    }
    const enums = {};
    for (const [_, enumData] of Object.entries(modelIntrospection.enums)) {
        enums[enumData.name] = {
            values: () => enumData.values,
        };
    }
    return enums;
};
exports.generateEnumsProperty = generateEnumsProperty;
//# sourceMappingURL=generateEnumsProperty.js.map
