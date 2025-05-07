// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const constructContentDisposition = (contentDisposition) => {
    if (!contentDisposition)
        return undefined;
    if (typeof contentDisposition === 'string')
        return contentDisposition;
    const { type, filename } = contentDisposition;
    return filename !== undefined ? `${type}; filename="${filename}"` : type;
};

export { constructContentDisposition };
//# sourceMappingURL=constructContentDisposition.mjs.map
