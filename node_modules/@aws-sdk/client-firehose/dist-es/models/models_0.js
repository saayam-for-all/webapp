import { SENSITIVE_STRING } from "@smithy/smithy-client";
import { FirehoseServiceException as __BaseException } from "./FirehoseServiceException";
export const ProcessorParameterName = {
    BUFFER_INTERVAL_IN_SECONDS: "BufferIntervalInSeconds",
    BUFFER_SIZE_IN_MB: "BufferSizeInMBs",
    COMPRESSION_FORMAT: "CompressionFormat",
    DATA_MESSAGE_EXTRACTION: "DataMessageExtraction",
    Delimiter: "Delimiter",
    JSON_PARSING_ENGINE: "JsonParsingEngine",
    LAMBDA_ARN: "LambdaArn",
    LAMBDA_NUMBER_OF_RETRIES: "NumberOfRetries",
    METADATA_EXTRACTION_QUERY: "MetadataExtractionQuery",
    ROLE_ARN: "RoleArn",
    SUB_RECORD_TYPE: "SubRecordType",
};
export const ProcessorType = {
    AppendDelimiterToRecord: "AppendDelimiterToRecord",
    CloudWatchLogProcessing: "CloudWatchLogProcessing",
    Decompression: "Decompression",
    Lambda: "Lambda",
    MetadataExtraction: "MetadataExtraction",
    RecordDeAggregation: "RecordDeAggregation",
};
export const AmazonOpenSearchServerlessS3BackupMode = {
    AllDocuments: "AllDocuments",
    FailedDocumentsOnly: "FailedDocumentsOnly",
};
export const CompressionFormat = {
    GZIP: "GZIP",
    HADOOP_SNAPPY: "HADOOP_SNAPPY",
    SNAPPY: "Snappy",
    UNCOMPRESSED: "UNCOMPRESSED",
    ZIP: "ZIP",
};
export const NoEncryptionConfig = {
    NoEncryption: "NoEncryption",
};
export const DefaultDocumentIdFormat = {
    FIREHOSE_DEFAULT: "FIREHOSE_DEFAULT",
    NO_DOCUMENT_ID: "NO_DOCUMENT_ID",
};
export const AmazonopensearchserviceIndexRotationPeriod = {
    NoRotation: "NoRotation",
    OneDay: "OneDay",
    OneHour: "OneHour",
    OneMonth: "OneMonth",
    OneWeek: "OneWeek",
};
export const AmazonopensearchserviceS3BackupMode = {
    AllDocuments: "AllDocuments",
    FailedDocumentsOnly: "FailedDocumentsOnly",
};
export const Connectivity = {
    PRIVATE: "PRIVATE",
    PUBLIC: "PUBLIC",
};
export class ConcurrentModificationException extends __BaseException {
    constructor(opts) {
        super({
            name: "ConcurrentModificationException",
            $fault: "client",
            ...opts,
        });
        this.name = "ConcurrentModificationException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ConcurrentModificationException.prototype);
    }
}
export const ContentEncoding = {
    GZIP: "GZIP",
    NONE: "NONE",
};
export const KeyType = {
    AWS_OWNED_CMK: "AWS_OWNED_CMK",
    CUSTOMER_MANAGED_CMK: "CUSTOMER_MANAGED_CMK",
};
export const DeliveryStreamType = {
    DirectPut: "DirectPut",
    KinesisStreamAsSource: "KinesisStreamAsSource",
    MSKAsSource: "MSKAsSource",
};
export const ElasticsearchIndexRotationPeriod = {
    NoRotation: "NoRotation",
    OneDay: "OneDay",
    OneHour: "OneHour",
    OneMonth: "OneMonth",
    OneWeek: "OneWeek",
};
export const ElasticsearchS3BackupMode = {
    AllDocuments: "AllDocuments",
    FailedDocumentsOnly: "FailedDocumentsOnly",
};
export const OrcCompression = {
    NONE: "NONE",
    SNAPPY: "SNAPPY",
    ZLIB: "ZLIB",
};
export const OrcFormatVersion = {
    V0_11: "V0_11",
    V0_12: "V0_12",
};
export const ParquetCompression = {
    GZIP: "GZIP",
    SNAPPY: "SNAPPY",
    UNCOMPRESSED: "UNCOMPRESSED",
};
export const ParquetWriterVersion = {
    V1: "V1",
    V2: "V2",
};
export const S3BackupMode = {
    Disabled: "Disabled",
    Enabled: "Enabled",
};
export const HttpEndpointS3BackupMode = {
    AllData: "AllData",
    FailedDataOnly: "FailedDataOnly",
};
export const IcebergS3BackupMode = {
    AllData: "AllData",
    FailedDataOnly: "FailedDataOnly",
};
export const RedshiftS3BackupMode = {
    Disabled: "Disabled",
    Enabled: "Enabled",
};
export const SnowflakeDataLoadingOption = {
    JSON_MAPPING: "JSON_MAPPING",
    VARIANT_CONTENT_AND_METADATA_MAPPING: "VARIANT_CONTENT_AND_METADATA_MAPPING",
    VARIANT_CONTENT_MAPPING: "VARIANT_CONTENT_MAPPING",
};
export const SnowflakeS3BackupMode = {
    AllData: "AllData",
    FailedDataOnly: "FailedDataOnly",
};
export const HECEndpointType = {
    Event: "Event",
    Raw: "Raw",
};
export const SplunkS3BackupMode = {
    AllEvents: "AllEvents",
    FailedEventsOnly: "FailedEventsOnly",
};
export class InvalidArgumentException extends __BaseException {
    constructor(opts) {
        super({
            name: "InvalidArgumentException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidArgumentException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidArgumentException.prototype);
    }
}
export class InvalidKMSResourceException extends __BaseException {
    constructor(opts) {
        super({
            name: "InvalidKMSResourceException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidKMSResourceException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidKMSResourceException.prototype);
        this.code = opts.code;
    }
}
export class LimitExceededException extends __BaseException {
    constructor(opts) {
        super({
            name: "LimitExceededException",
            $fault: "client",
            ...opts,
        });
        this.name = "LimitExceededException";
        this.$fault = "client";
        Object.setPrototypeOf(this, LimitExceededException.prototype);
    }
}
export class ResourceInUseException extends __BaseException {
    constructor(opts) {
        super({
            name: "ResourceInUseException",
            $fault: "client",
            ...opts,
        });
        this.name = "ResourceInUseException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceInUseException.prototype);
    }
}
export class ResourceNotFoundException extends __BaseException {
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        this.name = "ResourceNotFoundException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
}
export const DeliveryStreamFailureType = {
    CREATE_ENI_FAILED: "CREATE_ENI_FAILED",
    CREATE_KMS_GRANT_FAILED: "CREATE_KMS_GRANT_FAILED",
    DELETE_ENI_FAILED: "DELETE_ENI_FAILED",
    DISABLED_KMS_KEY: "DISABLED_KMS_KEY",
    ENI_ACCESS_DENIED: "ENI_ACCESS_DENIED",
    INVALID_KMS_KEY: "INVALID_KMS_KEY",
    KMS_ACCESS_DENIED: "KMS_ACCESS_DENIED",
    KMS_KEY_NOT_FOUND: "KMS_KEY_NOT_FOUND",
    KMS_OPT_IN_REQUIRED: "KMS_OPT_IN_REQUIRED",
    RETIRE_KMS_GRANT_FAILED: "RETIRE_KMS_GRANT_FAILED",
    SECURITY_GROUP_ACCESS_DENIED: "SECURITY_GROUP_ACCESS_DENIED",
    SECURITY_GROUP_NOT_FOUND: "SECURITY_GROUP_NOT_FOUND",
    SUBNET_ACCESS_DENIED: "SUBNET_ACCESS_DENIED",
    SUBNET_NOT_FOUND: "SUBNET_NOT_FOUND",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
};
export const DeliveryStreamEncryptionStatus = {
    DISABLED: "DISABLED",
    DISABLING: "DISABLING",
    DISABLING_FAILED: "DISABLING_FAILED",
    ENABLED: "ENABLED",
    ENABLING: "ENABLING",
    ENABLING_FAILED: "ENABLING_FAILED",
};
export const DeliveryStreamStatus = {
    ACTIVE: "ACTIVE",
    CREATING: "CREATING",
    CREATING_FAILED: "CREATING_FAILED",
    DELETING: "DELETING",
    DELETING_FAILED: "DELETING_FAILED",
};
export class InvalidSourceException extends __BaseException {
    constructor(opts) {
        super({
            name: "InvalidSourceException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidSourceException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidSourceException.prototype);
        this.code = opts.code;
    }
}
export class ServiceUnavailableException extends __BaseException {
    constructor(opts) {
        super({
            name: "ServiceUnavailableException",
            $fault: "server",
            ...opts,
        });
        this.name = "ServiceUnavailableException";
        this.$fault = "server";
        Object.setPrototypeOf(this, ServiceUnavailableException.prototype);
    }
}
export const HttpEndpointConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Url && { Url: SENSITIVE_STRING }),
    ...(obj.AccessKey && { AccessKey: SENSITIVE_STRING }),
});
export const HttpEndpointCommonAttributeFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.AttributeName && { AttributeName: SENSITIVE_STRING }),
    ...(obj.AttributeValue && { AttributeValue: SENSITIVE_STRING }),
});
export const HttpEndpointRequestConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.CommonAttributes && {
        CommonAttributes: obj.CommonAttributes.map((item) => HttpEndpointCommonAttributeFilterSensitiveLog(item)),
    }),
});
export const HttpEndpointDestinationConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.EndpointConfiguration && {
        EndpointConfiguration: HttpEndpointConfigurationFilterSensitiveLog(obj.EndpointConfiguration),
    }),
    ...(obj.RequestConfiguration && {
        RequestConfiguration: HttpEndpointRequestConfigurationFilterSensitiveLog(obj.RequestConfiguration),
    }),
});
export const RedshiftDestinationConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Username && { Username: SENSITIVE_STRING }),
    ...(obj.Password && { Password: SENSITIVE_STRING }),
});
export const SnowflakeRoleConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.SnowflakeRole && { SnowflakeRole: SENSITIVE_STRING }),
});
export const SnowflakeVpcConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.PrivateLinkVpceId && { PrivateLinkVpceId: SENSITIVE_STRING }),
});
export const SnowflakeDestinationConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.AccountUrl && { AccountUrl: SENSITIVE_STRING }),
    ...(obj.PrivateKey && { PrivateKey: SENSITIVE_STRING }),
    ...(obj.KeyPassphrase && { KeyPassphrase: SENSITIVE_STRING }),
    ...(obj.User && { User: SENSITIVE_STRING }),
    ...(obj.Database && { Database: SENSITIVE_STRING }),
    ...(obj.Schema && { Schema: SENSITIVE_STRING }),
    ...(obj.Table && { Table: SENSITIVE_STRING }),
    ...(obj.SnowflakeRoleConfiguration && {
        SnowflakeRoleConfiguration: SnowflakeRoleConfigurationFilterSensitiveLog(obj.SnowflakeRoleConfiguration),
    }),
    ...(obj.MetaDataColumnName && { MetaDataColumnName: SENSITIVE_STRING }),
    ...(obj.ContentColumnName && { ContentColumnName: SENSITIVE_STRING }),
    ...(obj.SnowflakeVpcConfiguration && {
        SnowflakeVpcConfiguration: SnowflakeVpcConfigurationFilterSensitiveLog(obj.SnowflakeVpcConfiguration),
    }),
});
export const CreateDeliveryStreamInputFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.RedshiftDestinationConfiguration && {
        RedshiftDestinationConfiguration: RedshiftDestinationConfigurationFilterSensitiveLog(obj.RedshiftDestinationConfiguration),
    }),
    ...(obj.HttpEndpointDestinationConfiguration && {
        HttpEndpointDestinationConfiguration: HttpEndpointDestinationConfigurationFilterSensitiveLog(obj.HttpEndpointDestinationConfiguration),
    }),
    ...(obj.SnowflakeDestinationConfiguration && {
        SnowflakeDestinationConfiguration: SnowflakeDestinationConfigurationFilterSensitiveLog(obj.SnowflakeDestinationConfiguration),
    }),
});
export const HttpEndpointDescriptionFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Url && { Url: SENSITIVE_STRING }),
});
export const HttpEndpointDestinationDescriptionFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.EndpointConfiguration && {
        EndpointConfiguration: HttpEndpointDescriptionFilterSensitiveLog(obj.EndpointConfiguration),
    }),
    ...(obj.RequestConfiguration && {
        RequestConfiguration: HttpEndpointRequestConfigurationFilterSensitiveLog(obj.RequestConfiguration),
    }),
});
export const RedshiftDestinationDescriptionFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Username && { Username: SENSITIVE_STRING }),
});
export const SnowflakeDestinationDescriptionFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.AccountUrl && { AccountUrl: SENSITIVE_STRING }),
    ...(obj.User && { User: SENSITIVE_STRING }),
    ...(obj.Database && { Database: SENSITIVE_STRING }),
    ...(obj.Schema && { Schema: SENSITIVE_STRING }),
    ...(obj.Table && { Table: SENSITIVE_STRING }),
    ...(obj.SnowflakeRoleConfiguration && {
        SnowflakeRoleConfiguration: SnowflakeRoleConfigurationFilterSensitiveLog(obj.SnowflakeRoleConfiguration),
    }),
    ...(obj.MetaDataColumnName && { MetaDataColumnName: SENSITIVE_STRING }),
    ...(obj.ContentColumnName && { ContentColumnName: SENSITIVE_STRING }),
    ...(obj.SnowflakeVpcConfiguration && {
        SnowflakeVpcConfiguration: SnowflakeVpcConfigurationFilterSensitiveLog(obj.SnowflakeVpcConfiguration),
    }),
});
export const DestinationDescriptionFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.RedshiftDestinationDescription && {
        RedshiftDestinationDescription: RedshiftDestinationDescriptionFilterSensitiveLog(obj.RedshiftDestinationDescription),
    }),
    ...(obj.HttpEndpointDestinationDescription && {
        HttpEndpointDestinationDescription: HttpEndpointDestinationDescriptionFilterSensitiveLog(obj.HttpEndpointDestinationDescription),
    }),
    ...(obj.SnowflakeDestinationDescription && {
        SnowflakeDestinationDescription: SnowflakeDestinationDescriptionFilterSensitiveLog(obj.SnowflakeDestinationDescription),
    }),
});
export const DeliveryStreamDescriptionFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Destinations && {
        Destinations: obj.Destinations.map((item) => DestinationDescriptionFilterSensitiveLog(item)),
    }),
});
export const DescribeDeliveryStreamOutputFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.DeliveryStreamDescription && {
        DeliveryStreamDescription: DeliveryStreamDescriptionFilterSensitiveLog(obj.DeliveryStreamDescription),
    }),
});
export const HttpEndpointDestinationUpdateFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.EndpointConfiguration && {
        EndpointConfiguration: HttpEndpointConfigurationFilterSensitiveLog(obj.EndpointConfiguration),
    }),
    ...(obj.RequestConfiguration && {
        RequestConfiguration: HttpEndpointRequestConfigurationFilterSensitiveLog(obj.RequestConfiguration),
    }),
});
export const RedshiftDestinationUpdateFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Username && { Username: SENSITIVE_STRING }),
    ...(obj.Password && { Password: SENSITIVE_STRING }),
});
export const SnowflakeDestinationUpdateFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.AccountUrl && { AccountUrl: SENSITIVE_STRING }),
    ...(obj.PrivateKey && { PrivateKey: SENSITIVE_STRING }),
    ...(obj.KeyPassphrase && { KeyPassphrase: SENSITIVE_STRING }),
    ...(obj.User && { User: SENSITIVE_STRING }),
    ...(obj.Database && { Database: SENSITIVE_STRING }),
    ...(obj.Schema && { Schema: SENSITIVE_STRING }),
    ...(obj.Table && { Table: SENSITIVE_STRING }),
    ...(obj.SnowflakeRoleConfiguration && {
        SnowflakeRoleConfiguration: SnowflakeRoleConfigurationFilterSensitiveLog(obj.SnowflakeRoleConfiguration),
    }),
    ...(obj.MetaDataColumnName && { MetaDataColumnName: SENSITIVE_STRING }),
    ...(obj.ContentColumnName && { ContentColumnName: SENSITIVE_STRING }),
});
export const UpdateDestinationInputFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.RedshiftDestinationUpdate && {
        RedshiftDestinationUpdate: RedshiftDestinationUpdateFilterSensitiveLog(obj.RedshiftDestinationUpdate),
    }),
    ...(obj.HttpEndpointDestinationUpdate && {
        HttpEndpointDestinationUpdate: HttpEndpointDestinationUpdateFilterSensitiveLog(obj.HttpEndpointDestinationUpdate),
    }),
    ...(obj.SnowflakeDestinationUpdate && {
        SnowflakeDestinationUpdate: SnowflakeDestinationUpdateFilterSensitiveLog(obj.SnowflakeDestinationUpdate),
    }),
});
