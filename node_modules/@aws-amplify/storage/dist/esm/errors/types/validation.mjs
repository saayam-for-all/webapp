// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var StorageValidationErrorCode;
(function (StorageValidationErrorCode) {
    StorageValidationErrorCode["NoCredentials"] = "NoCredentials";
    StorageValidationErrorCode["NoIdentityId"] = "NoIdentityId";
    StorageValidationErrorCode["NoKey"] = "NoKey";
    StorageValidationErrorCode["NoSourceKey"] = "NoSourceKey";
    StorageValidationErrorCode["NoDestinationKey"] = "NoDestinationKey";
    StorageValidationErrorCode["NoSourcePath"] = "NoSourcePath";
    StorageValidationErrorCode["NoDestinationPath"] = "NoDestinationPath";
    StorageValidationErrorCode["NoBucket"] = "NoBucket";
    StorageValidationErrorCode["NoRegion"] = "NoRegion";
    StorageValidationErrorCode["InvalidStorageBucket"] = "InvalidStorageBucket";
    StorageValidationErrorCode["InvalidCopyOperationStorageBucket"] = "InvalidCopyOperationStorageBucket";
    StorageValidationErrorCode["InvalidStorageOperationPrefixInput"] = "InvalidStorageOperationPrefixInput";
    StorageValidationErrorCode["InvalidStorageOperationInput"] = "InvalidStorageOperationInput";
    StorageValidationErrorCode["InvalidAWSAccountID"] = "InvalidAWSAccountID";
    StorageValidationErrorCode["InvalidStoragePathInput"] = "InvalidStoragePathInput";
    StorageValidationErrorCode["InvalidUploadSource"] = "InvalidUploadSource";
    StorageValidationErrorCode["ObjectIsTooLarge"] = "ObjectIsTooLarge";
    StorageValidationErrorCode["UrlExpirationMaxLimitExceed"] = "UrlExpirationMaxLimitExceed";
    StorageValidationErrorCode["InvalidLocationCredentialsCacheSize"] = "InvalidLocationCredentialsCacheSize";
    StorageValidationErrorCode["LocationCredentialsStoreDestroyed"] = "LocationCredentialsStoreDestroyed";
    StorageValidationErrorCode["InvalidS3Uri"] = "InvalidS3Uri";
    StorageValidationErrorCode["InvalidCustomEndpoint"] = "InvalidCustomEndpoint";
    StorageValidationErrorCode["ForcePathStyleEndpointNotSupported"] = "ForcePathStyleEndpointNotSupported";
    StorageValidationErrorCode["DnsIncompatibleBucketName"] = "DnsIncompatibleBucketName";
})(StorageValidationErrorCode || (StorageValidationErrorCode = {}));
const validationErrorMap = {
    [StorageValidationErrorCode.NoCredentials]: {
        message: 'Credentials should not be empty.',
    },
    [StorageValidationErrorCode.NoIdentityId]: {
        message: 'Missing identity ID when accessing objects in protected or private access level.',
    },
    [StorageValidationErrorCode.NoKey]: {
        message: 'Missing key in api call.',
    },
    [StorageValidationErrorCode.NoSourceKey]: {
        message: 'Missing source key in copy api call.',
    },
    [StorageValidationErrorCode.NoDestinationKey]: {
        message: 'Missing destination key in copy api call.',
    },
    [StorageValidationErrorCode.NoSourcePath]: {
        message: 'Missing source path in copy api call.',
    },
    [StorageValidationErrorCode.NoDestinationPath]: {
        message: 'Missing destination path in copy api call.',
    },
    [StorageValidationErrorCode.NoBucket]: {
        message: 'Missing bucket name while accessing object.',
    },
    [StorageValidationErrorCode.NoRegion]: {
        message: 'Missing region while accessing object.',
    },
    [StorageValidationErrorCode.UrlExpirationMaxLimitExceed]: {
        message: 'Url Expiration can not be greater than 7 Days.',
    },
    [StorageValidationErrorCode.ObjectIsTooLarge]: {
        message: 'Object size cannot not be greater than 5TB.',
    },
    [StorageValidationErrorCode.InvalidUploadSource]: {
        message: 'Upload source type can only be a `Blob`, `File`, `ArrayBuffer`, or `string`.',
    },
    [StorageValidationErrorCode.InvalidStorageOperationInput]: {
        message: 'Path or key parameter must be specified in the input. Both can not be specified at the same time.',
    },
    [StorageValidationErrorCode.InvalidAWSAccountID]: {
        message: 'Invalid AWS account ID was provided.',
    },
    [StorageValidationErrorCode.InvalidStorageOperationPrefixInput]: {
        message: 'Both path and prefix can not be specified at the same time.',
    },
    [StorageValidationErrorCode.InvalidStoragePathInput]: {
        message: 'Input `path` does not allow a leading slash (/).',
    },
    [StorageValidationErrorCode.InvalidLocationCredentialsCacheSize]: {
        message: 'locationCredentialsCacheSize must be a positive integer.',
    },
    [StorageValidationErrorCode.LocationCredentialsStoreDestroyed]: {
        message: `Location-specific credentials store has been destroyed.`,
    },
    [StorageValidationErrorCode.InvalidS3Uri]: {
        message: 'Invalid S3 URI.',
    },
    [StorageValidationErrorCode.InvalidStorageBucket]: {
        message: 'Unable to lookup bucket from provided name in Amplify configuration.',
    },
    [StorageValidationErrorCode.InvalidCopyOperationStorageBucket]: {
        message: 'Missing bucket option in either source or destination.',
    },
    [StorageValidationErrorCode.InvalidCustomEndpoint]: {
        message: 'Invalid S3 custom endpoint.',
    },
    [StorageValidationErrorCode.ForcePathStyleEndpointNotSupported]: {
        message: 'Path style URLs are not supported with S3 Transfer Acceleration.',
    },
    [StorageValidationErrorCode.DnsIncompatibleBucketName]: {
        message: `The bucket name isn't DNS compatible.`,
    },
};

export { StorageValidationErrorCode, validationErrorMap };
//# sourceMappingURL=validation.mjs.map
