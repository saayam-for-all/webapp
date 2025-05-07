import { AmplifyErrorMap } from '@aws-amplify/core/internals/utils';
export declare enum StorageValidationErrorCode {
    NoCredentials = "NoCredentials",
    NoIdentityId = "NoIdentityId",
    NoKey = "NoKey",
    NoSourceKey = "NoSourceKey",
    NoDestinationKey = "NoDestinationKey",
    NoSourcePath = "NoSourcePath",
    NoDestinationPath = "NoDestinationPath",
    NoBucket = "NoBucket",
    NoRegion = "NoRegion",
    InvalidStorageBucket = "InvalidStorageBucket",
    InvalidCopyOperationStorageBucket = "InvalidCopyOperationStorageBucket",
    InvalidStorageOperationPrefixInput = "InvalidStorageOperationPrefixInput",
    InvalidStorageOperationInput = "InvalidStorageOperationInput",
    InvalidAWSAccountID = "InvalidAWSAccountID",
    InvalidStoragePathInput = "InvalidStoragePathInput",
    InvalidUploadSource = "InvalidUploadSource",
    ObjectIsTooLarge = "ObjectIsTooLarge",
    UrlExpirationMaxLimitExceed = "UrlExpirationMaxLimitExceed",
    InvalidLocationCredentialsCacheSize = "InvalidLocationCredentialsCacheSize",
    LocationCredentialsStoreDestroyed = "LocationCredentialsStoreDestroyed",
    InvalidS3Uri = "InvalidS3Uri",
    InvalidCustomEndpoint = "InvalidCustomEndpoint",
    ForcePathStyleEndpointNotSupported = "ForcePathStyleEndpointNotSupported",
    DnsIncompatibleBucketName = "DnsIncompatibleBucketName"
}
export declare const validationErrorMap: AmplifyErrorMap<StorageValidationErrorCode>;
