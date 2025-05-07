// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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

export { generateEnumsProperty };
//# sourceMappingURL=generateEnumsProperty.mjs.map
