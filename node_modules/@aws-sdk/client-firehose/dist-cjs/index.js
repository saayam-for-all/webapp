"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AmazonOpenSearchServerlessS3BackupMode: () => AmazonOpenSearchServerlessS3BackupMode,
  AmazonopensearchserviceIndexRotationPeriod: () => AmazonopensearchserviceIndexRotationPeriod,
  AmazonopensearchserviceS3BackupMode: () => AmazonopensearchserviceS3BackupMode,
  CompressionFormat: () => CompressionFormat,
  ConcurrentModificationException: () => ConcurrentModificationException,
  Connectivity: () => Connectivity,
  ContentEncoding: () => ContentEncoding,
  CreateDeliveryStreamCommand: () => CreateDeliveryStreamCommand,
  CreateDeliveryStreamInputFilterSensitiveLog: () => CreateDeliveryStreamInputFilterSensitiveLog,
  DefaultDocumentIdFormat: () => DefaultDocumentIdFormat,
  DeleteDeliveryStreamCommand: () => DeleteDeliveryStreamCommand,
  DeliveryStreamDescriptionFilterSensitiveLog: () => DeliveryStreamDescriptionFilterSensitiveLog,
  DeliveryStreamEncryptionStatus: () => DeliveryStreamEncryptionStatus,
  DeliveryStreamFailureType: () => DeliveryStreamFailureType,
  DeliveryStreamStatus: () => DeliveryStreamStatus,
  DeliveryStreamType: () => DeliveryStreamType,
  DescribeDeliveryStreamCommand: () => DescribeDeliveryStreamCommand,
  DescribeDeliveryStreamOutputFilterSensitiveLog: () => DescribeDeliveryStreamOutputFilterSensitiveLog,
  DestinationDescriptionFilterSensitiveLog: () => DestinationDescriptionFilterSensitiveLog,
  ElasticsearchIndexRotationPeriod: () => ElasticsearchIndexRotationPeriod,
  ElasticsearchS3BackupMode: () => ElasticsearchS3BackupMode,
  Firehose: () => Firehose,
  FirehoseClient: () => FirehoseClient,
  FirehoseServiceException: () => FirehoseServiceException,
  HECEndpointType: () => HECEndpointType,
  HttpEndpointCommonAttributeFilterSensitiveLog: () => HttpEndpointCommonAttributeFilterSensitiveLog,
  HttpEndpointConfigurationFilterSensitiveLog: () => HttpEndpointConfigurationFilterSensitiveLog,
  HttpEndpointDescriptionFilterSensitiveLog: () => HttpEndpointDescriptionFilterSensitiveLog,
  HttpEndpointDestinationConfigurationFilterSensitiveLog: () => HttpEndpointDestinationConfigurationFilterSensitiveLog,
  HttpEndpointDestinationDescriptionFilterSensitiveLog: () => HttpEndpointDestinationDescriptionFilterSensitiveLog,
  HttpEndpointDestinationUpdateFilterSensitiveLog: () => HttpEndpointDestinationUpdateFilterSensitiveLog,
  HttpEndpointRequestConfigurationFilterSensitiveLog: () => HttpEndpointRequestConfigurationFilterSensitiveLog,
  HttpEndpointS3BackupMode: () => HttpEndpointS3BackupMode,
  IcebergS3BackupMode: () => IcebergS3BackupMode,
  InvalidArgumentException: () => InvalidArgumentException,
  InvalidKMSResourceException: () => InvalidKMSResourceException,
  InvalidSourceException: () => InvalidSourceException,
  KeyType: () => KeyType,
  LimitExceededException: () => LimitExceededException,
  ListDeliveryStreamsCommand: () => ListDeliveryStreamsCommand,
  ListTagsForDeliveryStreamCommand: () => ListTagsForDeliveryStreamCommand,
  NoEncryptionConfig: () => NoEncryptionConfig,
  OrcCompression: () => OrcCompression,
  OrcFormatVersion: () => OrcFormatVersion,
  ParquetCompression: () => ParquetCompression,
  ParquetWriterVersion: () => ParquetWriterVersion,
  ProcessorParameterName: () => ProcessorParameterName,
  ProcessorType: () => ProcessorType,
  PutRecordBatchCommand: () => PutRecordBatchCommand,
  PutRecordCommand: () => PutRecordCommand,
  RedshiftDestinationConfigurationFilterSensitiveLog: () => RedshiftDestinationConfigurationFilterSensitiveLog,
  RedshiftDestinationDescriptionFilterSensitiveLog: () => RedshiftDestinationDescriptionFilterSensitiveLog,
  RedshiftDestinationUpdateFilterSensitiveLog: () => RedshiftDestinationUpdateFilterSensitiveLog,
  RedshiftS3BackupMode: () => RedshiftS3BackupMode,
  ResourceInUseException: () => ResourceInUseException,
  ResourceNotFoundException: () => ResourceNotFoundException,
  S3BackupMode: () => S3BackupMode,
  ServiceUnavailableException: () => ServiceUnavailableException,
  SnowflakeDataLoadingOption: () => SnowflakeDataLoadingOption,
  SnowflakeDestinationConfigurationFilterSensitiveLog: () => SnowflakeDestinationConfigurationFilterSensitiveLog,
  SnowflakeDestinationDescriptionFilterSensitiveLog: () => SnowflakeDestinationDescriptionFilterSensitiveLog,
  SnowflakeDestinationUpdateFilterSensitiveLog: () => SnowflakeDestinationUpdateFilterSensitiveLog,
  SnowflakeRoleConfigurationFilterSensitiveLog: () => SnowflakeRoleConfigurationFilterSensitiveLog,
  SnowflakeS3BackupMode: () => SnowflakeS3BackupMode,
  SnowflakeVpcConfigurationFilterSensitiveLog: () => SnowflakeVpcConfigurationFilterSensitiveLog,
  SplunkS3BackupMode: () => SplunkS3BackupMode,
  StartDeliveryStreamEncryptionCommand: () => StartDeliveryStreamEncryptionCommand,
  StopDeliveryStreamEncryptionCommand: () => StopDeliveryStreamEncryptionCommand,
  TagDeliveryStreamCommand: () => TagDeliveryStreamCommand,
  UntagDeliveryStreamCommand: () => UntagDeliveryStreamCommand,
  UpdateDestinationCommand: () => UpdateDestinationCommand,
  UpdateDestinationInputFilterSensitiveLog: () => UpdateDestinationInputFilterSensitiveLog,
  __Client: () => import_smithy_client.Client
});
module.exports = __toCommonJS(src_exports);

// src/FirehoseClient.ts
var import_middleware_host_header = require("@aws-sdk/middleware-host-header");
var import_middleware_logger = require("@aws-sdk/middleware-logger");
var import_middleware_recursion_detection = require("@aws-sdk/middleware-recursion-detection");
var import_middleware_user_agent = require("@aws-sdk/middleware-user-agent");
var import_config_resolver = require("@smithy/config-resolver");
var import_core = require("@smithy/core");
var import_middleware_content_length = require("@smithy/middleware-content-length");
var import_middleware_endpoint = require("@smithy/middleware-endpoint");
var import_middleware_retry = require("@smithy/middleware-retry");

var import_httpAuthSchemeProvider = require("./auth/httpAuthSchemeProvider");

// src/endpoint/EndpointParameters.ts
var resolveClientEndpointParameters = /* @__PURE__ */ __name((options) => {
  return {
    ...options,
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "firehose"
  };
}, "resolveClientEndpointParameters");
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// src/FirehoseClient.ts
var import_runtimeConfig = require("././runtimeConfig");

// src/runtimeExtensions.ts
var import_region_config_resolver = require("@aws-sdk/region-config-resolver");
var import_protocol_http = require("@smithy/protocol-http");
var import_smithy_client = require("@smithy/smithy-client");

// src/auth/httpAuthExtensionConfiguration.ts
var getHttpAuthExtensionConfiguration = /* @__PURE__ */ __name((runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
}, "getHttpAuthExtensionConfiguration");
var resolveHttpAuthRuntimeConfig = /* @__PURE__ */ __name((config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
}, "resolveHttpAuthRuntimeConfig");

// src/runtimeExtensions.ts
var asPartial = /* @__PURE__ */ __name((t) => t, "asPartial");
var resolveRuntimeExtensions = /* @__PURE__ */ __name((runtimeConfig, extensions) => {
  const extensionConfiguration = {
    ...asPartial((0, import_region_config_resolver.getAwsRegionExtensionConfiguration)(runtimeConfig)),
    ...asPartial((0, import_smithy_client.getDefaultExtensionConfiguration)(runtimeConfig)),
    ...asPartial((0, import_protocol_http.getHttpHandlerExtensionConfiguration)(runtimeConfig)),
    ...asPartial(getHttpAuthExtensionConfiguration(runtimeConfig))
  };
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return {
    ...runtimeConfig,
    ...(0, import_region_config_resolver.resolveAwsRegionExtensionConfiguration)(extensionConfiguration),
    ...(0, import_smithy_client.resolveDefaultRuntimeConfig)(extensionConfiguration),
    ...(0, import_protocol_http.resolveHttpHandlerRuntimeConfig)(extensionConfiguration),
    ...resolveHttpAuthRuntimeConfig(extensionConfiguration)
  };
}, "resolveRuntimeExtensions");

// src/FirehoseClient.ts
var _FirehoseClient = class _FirehoseClient extends import_smithy_client.Client {
  constructor(...[configuration]) {
    const _config_0 = (0, import_runtimeConfig.getRuntimeConfig)(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = (0, import_config_resolver.resolveRegionConfig)(_config_1);
    const _config_3 = (0, import_middleware_endpoint.resolveEndpointConfig)(_config_2);
    const _config_4 = (0, import_middleware_host_header.resolveHostHeaderConfig)(_config_3);
    const _config_5 = (0, import_middleware_user_agent.resolveUserAgentConfig)(_config_4);
    const _config_6 = (0, import_middleware_retry.resolveRetryConfig)(_config_5);
    const _config_7 = (0, import_httpAuthSchemeProvider.resolveHttpAuthSchemeConfig)(_config_6);
    const _config_8 = resolveRuntimeExtensions(_config_7, (configuration == null ? void 0 : configuration.extensions) || []);
    super(_config_8);
    this.config = _config_8;
    this.middlewareStack.use((0, import_middleware_host_header.getHostHeaderPlugin)(this.config));
    this.middlewareStack.use((0, import_middleware_logger.getLoggerPlugin)(this.config));
    this.middlewareStack.use((0, import_middleware_recursion_detection.getRecursionDetectionPlugin)(this.config));
    this.middlewareStack.use((0, import_middleware_user_agent.getUserAgentPlugin)(this.config));
    this.middlewareStack.use((0, import_middleware_retry.getRetryPlugin)(this.config));
    this.middlewareStack.use((0, import_middleware_content_length.getContentLengthPlugin)(this.config));
    this.middlewareStack.use(
      (0, import_core.getHttpAuthSchemeEndpointRuleSetPlugin)(this.config, {
        httpAuthSchemeParametersProvider: this.getDefaultHttpAuthSchemeParametersProvider(),
        identityProviderConfigProvider: this.getIdentityProviderConfigProvider()
      })
    );
    this.middlewareStack.use((0, import_core.getHttpSigningPlugin)(this.config));
  }
  /**
   * Destroy underlying resources, like sockets. It's usually not necessary to do this.
   * However in Node.js, it's best to explicitly shut down the client's agent when it is no longer needed.
   * Otherwise, sockets might stay open for quite a long time before the server terminates them.
   */
  destroy() {
    super.destroy();
  }
  getDefaultHttpAuthSchemeParametersProvider() {
    return import_httpAuthSchemeProvider.defaultFirehoseHttpAuthSchemeParametersProvider;
  }
  getIdentityProviderConfigProvider() {
    return async (config) => new import_core.DefaultIdentityProviderConfig({
      "aws.auth#sigv4": config.credentials
    });
  }
};
__name(_FirehoseClient, "FirehoseClient");
var FirehoseClient = _FirehoseClient;

// src/Firehose.ts


// src/commands/CreateDeliveryStreamCommand.ts

var import_middleware_serde = require("@smithy/middleware-serde");


// src/models/models_0.ts


// src/models/FirehoseServiceException.ts

var _FirehoseServiceException = class _FirehoseServiceException extends import_smithy_client.ServiceException {
  /**
   * @internal
   */
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _FirehoseServiceException.prototype);
  }
};
__name(_FirehoseServiceException, "FirehoseServiceException");
var FirehoseServiceException = _FirehoseServiceException;

// src/models/models_0.ts
var ProcessorParameterName = {
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
  SUB_RECORD_TYPE: "SubRecordType"
};
var ProcessorType = {
  AppendDelimiterToRecord: "AppendDelimiterToRecord",
  CloudWatchLogProcessing: "CloudWatchLogProcessing",
  Decompression: "Decompression",
  Lambda: "Lambda",
  MetadataExtraction: "MetadataExtraction",
  RecordDeAggregation: "RecordDeAggregation"
};
var AmazonOpenSearchServerlessS3BackupMode = {
  AllDocuments: "AllDocuments",
  FailedDocumentsOnly: "FailedDocumentsOnly"
};
var CompressionFormat = {
  GZIP: "GZIP",
  HADOOP_SNAPPY: "HADOOP_SNAPPY",
  SNAPPY: "Snappy",
  UNCOMPRESSED: "UNCOMPRESSED",
  ZIP: "ZIP"
};
var NoEncryptionConfig = {
  NoEncryption: "NoEncryption"
};
var DefaultDocumentIdFormat = {
  FIREHOSE_DEFAULT: "FIREHOSE_DEFAULT",
  NO_DOCUMENT_ID: "NO_DOCUMENT_ID"
};
var AmazonopensearchserviceIndexRotationPeriod = {
  NoRotation: "NoRotation",
  OneDay: "OneDay",
  OneHour: "OneHour",
  OneMonth: "OneMonth",
  OneWeek: "OneWeek"
};
var AmazonopensearchserviceS3BackupMode = {
  AllDocuments: "AllDocuments",
  FailedDocumentsOnly: "FailedDocumentsOnly"
};
var Connectivity = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC"
};
var _ConcurrentModificationException = class _ConcurrentModificationException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ConcurrentModificationException",
      $fault: "client",
      ...opts
    });
    this.name = "ConcurrentModificationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ConcurrentModificationException.prototype);
  }
};
__name(_ConcurrentModificationException, "ConcurrentModificationException");
var ConcurrentModificationException = _ConcurrentModificationException;
var ContentEncoding = {
  GZIP: "GZIP",
  NONE: "NONE"
};
var KeyType = {
  AWS_OWNED_CMK: "AWS_OWNED_CMK",
  CUSTOMER_MANAGED_CMK: "CUSTOMER_MANAGED_CMK"
};
var DeliveryStreamType = {
  DirectPut: "DirectPut",
  KinesisStreamAsSource: "KinesisStreamAsSource",
  MSKAsSource: "MSKAsSource"
};
var ElasticsearchIndexRotationPeriod = {
  NoRotation: "NoRotation",
  OneDay: "OneDay",
  OneHour: "OneHour",
  OneMonth: "OneMonth",
  OneWeek: "OneWeek"
};
var ElasticsearchS3BackupMode = {
  AllDocuments: "AllDocuments",
  FailedDocumentsOnly: "FailedDocumentsOnly"
};
var OrcCompression = {
  NONE: "NONE",
  SNAPPY: "SNAPPY",
  ZLIB: "ZLIB"
};
var OrcFormatVersion = {
  V0_11: "V0_11",
  V0_12: "V0_12"
};
var ParquetCompression = {
  GZIP: "GZIP",
  SNAPPY: "SNAPPY",
  UNCOMPRESSED: "UNCOMPRESSED"
};
var ParquetWriterVersion = {
  V1: "V1",
  V2: "V2"
};
var S3BackupMode = {
  Disabled: "Disabled",
  Enabled: "Enabled"
};
var HttpEndpointS3BackupMode = {
  AllData: "AllData",
  FailedDataOnly: "FailedDataOnly"
};
var IcebergS3BackupMode = {
  AllData: "AllData",
  FailedDataOnly: "FailedDataOnly"
};
var RedshiftS3BackupMode = {
  Disabled: "Disabled",
  Enabled: "Enabled"
};
var SnowflakeDataLoadingOption = {
  JSON_MAPPING: "JSON_MAPPING",
  VARIANT_CONTENT_AND_METADATA_MAPPING: "VARIANT_CONTENT_AND_METADATA_MAPPING",
  VARIANT_CONTENT_MAPPING: "VARIANT_CONTENT_MAPPING"
};
var SnowflakeS3BackupMode = {
  AllData: "AllData",
  FailedDataOnly: "FailedDataOnly"
};
var HECEndpointType = {
  Event: "Event",
  Raw: "Raw"
};
var SplunkS3BackupMode = {
  AllEvents: "AllEvents",
  FailedEventsOnly: "FailedEventsOnly"
};
var _InvalidArgumentException = class _InvalidArgumentException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "InvalidArgumentException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidArgumentException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidArgumentException.prototype);
  }
};
__name(_InvalidArgumentException, "InvalidArgumentException");
var InvalidArgumentException = _InvalidArgumentException;
var _InvalidKMSResourceException = class _InvalidKMSResourceException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "InvalidKMSResourceException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidKMSResourceException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidKMSResourceException.prototype);
    this.code = opts.code;
  }
};
__name(_InvalidKMSResourceException, "InvalidKMSResourceException");
var InvalidKMSResourceException = _InvalidKMSResourceException;
var _LimitExceededException = class _LimitExceededException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "LimitExceededException",
      $fault: "client",
      ...opts
    });
    this.name = "LimitExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _LimitExceededException.prototype);
  }
};
__name(_LimitExceededException, "LimitExceededException");
var LimitExceededException = _LimitExceededException;
var _ResourceInUseException = class _ResourceInUseException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ResourceInUseException",
      $fault: "client",
      ...opts
    });
    this.name = "ResourceInUseException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceInUseException.prototype);
  }
};
__name(_ResourceInUseException, "ResourceInUseException");
var ResourceInUseException = _ResourceInUseException;
var _ResourceNotFoundException = class _ResourceNotFoundException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ResourceNotFoundException",
      $fault: "client",
      ...opts
    });
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
  }
};
__name(_ResourceNotFoundException, "ResourceNotFoundException");
var ResourceNotFoundException = _ResourceNotFoundException;
var DeliveryStreamFailureType = {
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
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
};
var DeliveryStreamEncryptionStatus = {
  DISABLED: "DISABLED",
  DISABLING: "DISABLING",
  DISABLING_FAILED: "DISABLING_FAILED",
  ENABLED: "ENABLED",
  ENABLING: "ENABLING",
  ENABLING_FAILED: "ENABLING_FAILED"
};
var DeliveryStreamStatus = {
  ACTIVE: "ACTIVE",
  CREATING: "CREATING",
  CREATING_FAILED: "CREATING_FAILED",
  DELETING: "DELETING",
  DELETING_FAILED: "DELETING_FAILED"
};
var _InvalidSourceException = class _InvalidSourceException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "InvalidSourceException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidSourceException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidSourceException.prototype);
    this.code = opts.code;
  }
};
__name(_InvalidSourceException, "InvalidSourceException");
var InvalidSourceException = _InvalidSourceException;
var _ServiceUnavailableException = class _ServiceUnavailableException extends FirehoseServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ServiceUnavailableException",
      $fault: "server",
      ...opts
    });
    this.name = "ServiceUnavailableException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _ServiceUnavailableException.prototype);
  }
};
__name(_ServiceUnavailableException, "ServiceUnavailableException");
var ServiceUnavailableException = _ServiceUnavailableException;
var HttpEndpointConfigurationFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Url && { Url: import_smithy_client.SENSITIVE_STRING },
  ...obj.AccessKey && { AccessKey: import_smithy_client.SENSITIVE_STRING }
}), "HttpEndpointConfigurationFilterSensitiveLog");
var HttpEndpointCommonAttributeFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.AttributeName && { AttributeName: import_smithy_client.SENSITIVE_STRING },
  ...obj.AttributeValue && { AttributeValue: import_smithy_client.SENSITIVE_STRING }
}), "HttpEndpointCommonAttributeFilterSensitiveLog");
var HttpEndpointRequestConfigurationFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.CommonAttributes && {
    CommonAttributes: obj.CommonAttributes.map((item) => HttpEndpointCommonAttributeFilterSensitiveLog(item))
  }
}), "HttpEndpointRequestConfigurationFilterSensitiveLog");
var HttpEndpointDestinationConfigurationFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.EndpointConfiguration && {
    EndpointConfiguration: HttpEndpointConfigurationFilterSensitiveLog(obj.EndpointConfiguration)
  },
  ...obj.RequestConfiguration && {
    RequestConfiguration: HttpEndpointRequestConfigurationFilterSensitiveLog(obj.RequestConfiguration)
  }
}), "HttpEndpointDestinationConfigurationFilterSensitiveLog");
var RedshiftDestinationConfigurationFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Username && { Username: import_smithy_client.SENSITIVE_STRING },
  ...obj.Password && { Password: import_smithy_client.SENSITIVE_STRING }
}), "RedshiftDestinationConfigurationFilterSensitiveLog");
var SnowflakeRoleConfigurationFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.SnowflakeRole && { SnowflakeRole: import_smithy_client.SENSITIVE_STRING }
}), "SnowflakeRoleConfigurationFilterSensitiveLog");
var SnowflakeVpcConfigurationFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.PrivateLinkVpceId && { PrivateLinkVpceId: import_smithy_client.SENSITIVE_STRING }
}), "SnowflakeVpcConfigurationFilterSensitiveLog");
var SnowflakeDestinationConfigurationFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.AccountUrl && { AccountUrl: import_smithy_client.SENSITIVE_STRING },
  ...obj.PrivateKey && { PrivateKey: import_smithy_client.SENSITIVE_STRING },
  ...obj.KeyPassphrase && { KeyPassphrase: import_smithy_client.SENSITIVE_STRING },
  ...obj.User && { User: import_smithy_client.SENSITIVE_STRING },
  ...obj.Database && { Database: import_smithy_client.SENSITIVE_STRING },
  ...obj.Schema && { Schema: import_smithy_client.SENSITIVE_STRING },
  ...obj.Table && { Table: import_smithy_client.SENSITIVE_STRING },
  ...obj.SnowflakeRoleConfiguration && {
    SnowflakeRoleConfiguration: SnowflakeRoleConfigurationFilterSensitiveLog(obj.SnowflakeRoleConfiguration)
  },
  ...obj.MetaDataColumnName && { MetaDataColumnName: import_smithy_client.SENSITIVE_STRING },
  ...obj.ContentColumnName && { ContentColumnName: import_smithy_client.SENSITIVE_STRING },
  ...obj.SnowflakeVpcConfiguration && {
    SnowflakeVpcConfiguration: SnowflakeVpcConfigurationFilterSensitiveLog(obj.SnowflakeVpcConfiguration)
  }
}), "SnowflakeDestinationConfigurationFilterSensitiveLog");
var CreateDeliveryStreamInputFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.RedshiftDestinationConfiguration && {
    RedshiftDestinationConfiguration: RedshiftDestinationConfigurationFilterSensitiveLog(
      obj.RedshiftDestinationConfiguration
    )
  },
  ...obj.HttpEndpointDestinationConfiguration && {
    HttpEndpointDestinationConfiguration: HttpEndpointDestinationConfigurationFilterSensitiveLog(
      obj.HttpEndpointDestinationConfiguration
    )
  },
  ...obj.SnowflakeDestinationConfiguration && {
    SnowflakeDestinationConfiguration: SnowflakeDestinationConfigurationFilterSensitiveLog(
      obj.SnowflakeDestinationConfiguration
    )
  }
}), "CreateDeliveryStreamInputFilterSensitiveLog");
var HttpEndpointDescriptionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Url && { Url: import_smithy_client.SENSITIVE_STRING }
}), "HttpEndpointDescriptionFilterSensitiveLog");
var HttpEndpointDestinationDescriptionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.EndpointConfiguration && {
    EndpointConfiguration: HttpEndpointDescriptionFilterSensitiveLog(obj.EndpointConfiguration)
  },
  ...obj.RequestConfiguration && {
    RequestConfiguration: HttpEndpointRequestConfigurationFilterSensitiveLog(obj.RequestConfiguration)
  }
}), "HttpEndpointDestinationDescriptionFilterSensitiveLog");
var RedshiftDestinationDescriptionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Username && { Username: import_smithy_client.SENSITIVE_STRING }
}), "RedshiftDestinationDescriptionFilterSensitiveLog");
var SnowflakeDestinationDescriptionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.AccountUrl && { AccountUrl: import_smithy_client.SENSITIVE_STRING },
  ...obj.User && { User: import_smithy_client.SENSITIVE_STRING },
  ...obj.Database && { Database: import_smithy_client.SENSITIVE_STRING },
  ...obj.Schema && { Schema: import_smithy_client.SENSITIVE_STRING },
  ...obj.Table && { Table: import_smithy_client.SENSITIVE_STRING },
  ...obj.SnowflakeRoleConfiguration && {
    SnowflakeRoleConfiguration: SnowflakeRoleConfigurationFilterSensitiveLog(obj.SnowflakeRoleConfiguration)
  },
  ...obj.MetaDataColumnName && { MetaDataColumnName: import_smithy_client.SENSITIVE_STRING },
  ...obj.ContentColumnName && { ContentColumnName: import_smithy_client.SENSITIVE_STRING },
  ...obj.SnowflakeVpcConfiguration && {
    SnowflakeVpcConfiguration: SnowflakeVpcConfigurationFilterSensitiveLog(obj.SnowflakeVpcConfiguration)
  }
}), "SnowflakeDestinationDescriptionFilterSensitiveLog");
var DestinationDescriptionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.RedshiftDestinationDescription && {
    RedshiftDestinationDescription: RedshiftDestinationDescriptionFilterSensitiveLog(
      obj.RedshiftDestinationDescription
    )
  },
  ...obj.HttpEndpointDestinationDescription && {
    HttpEndpointDestinationDescription: HttpEndpointDestinationDescriptionFilterSensitiveLog(
      obj.HttpEndpointDestinationDescription
    )
  },
  ...obj.SnowflakeDestinationDescription && {
    SnowflakeDestinationDescription: SnowflakeDestinationDescriptionFilterSensitiveLog(
      obj.SnowflakeDestinationDescription
    )
  }
}), "DestinationDescriptionFilterSensitiveLog");
var DeliveryStreamDescriptionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Destinations && {
    Destinations: obj.Destinations.map((item) => DestinationDescriptionFilterSensitiveLog(item))
  }
}), "DeliveryStreamDescriptionFilterSensitiveLog");
var DescribeDeliveryStreamOutputFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.DeliveryStreamDescription && {
    DeliveryStreamDescription: DeliveryStreamDescriptionFilterSensitiveLog(obj.DeliveryStreamDescription)
  }
}), "DescribeDeliveryStreamOutputFilterSensitiveLog");
var HttpEndpointDestinationUpdateFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.EndpointConfiguration && {
    EndpointConfiguration: HttpEndpointConfigurationFilterSensitiveLog(obj.EndpointConfiguration)
  },
  ...obj.RequestConfiguration && {
    RequestConfiguration: HttpEndpointRequestConfigurationFilterSensitiveLog(obj.RequestConfiguration)
  }
}), "HttpEndpointDestinationUpdateFilterSensitiveLog");
var RedshiftDestinationUpdateFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.Username && { Username: import_smithy_client.SENSITIVE_STRING },
  ...obj.Password && { Password: import_smithy_client.SENSITIVE_STRING }
}), "RedshiftDestinationUpdateFilterSensitiveLog");
var SnowflakeDestinationUpdateFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.AccountUrl && { AccountUrl: import_smithy_client.SENSITIVE_STRING },
  ...obj.PrivateKey && { PrivateKey: import_smithy_client.SENSITIVE_STRING },
  ...obj.KeyPassphrase && { KeyPassphrase: import_smithy_client.SENSITIVE_STRING },
  ...obj.User && { User: import_smithy_client.SENSITIVE_STRING },
  ...obj.Database && { Database: import_smithy_client.SENSITIVE_STRING },
  ...obj.Schema && { Schema: import_smithy_client.SENSITIVE_STRING },
  ...obj.Table && { Table: import_smithy_client.SENSITIVE_STRING },
  ...obj.SnowflakeRoleConfiguration && {
    SnowflakeRoleConfiguration: SnowflakeRoleConfigurationFilterSensitiveLog(obj.SnowflakeRoleConfiguration)
  },
  ...obj.MetaDataColumnName && { MetaDataColumnName: import_smithy_client.SENSITIVE_STRING },
  ...obj.ContentColumnName && { ContentColumnName: import_smithy_client.SENSITIVE_STRING }
}), "SnowflakeDestinationUpdateFilterSensitiveLog");
var UpdateDestinationInputFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.RedshiftDestinationUpdate && {
    RedshiftDestinationUpdate: RedshiftDestinationUpdateFilterSensitiveLog(obj.RedshiftDestinationUpdate)
  },
  ...obj.HttpEndpointDestinationUpdate && {
    HttpEndpointDestinationUpdate: HttpEndpointDestinationUpdateFilterSensitiveLog(obj.HttpEndpointDestinationUpdate)
  },
  ...obj.SnowflakeDestinationUpdate && {
    SnowflakeDestinationUpdate: SnowflakeDestinationUpdateFilterSensitiveLog(obj.SnowflakeDestinationUpdate)
  }
}), "UpdateDestinationInputFilterSensitiveLog");

// src/protocols/Aws_json1_1.ts
var import_core2 = require("@aws-sdk/core");


var se_CreateDeliveryStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("CreateDeliveryStream");
  let body;
  body = JSON.stringify(se_CreateDeliveryStreamInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_CreateDeliveryStreamCommand");
var se_DeleteDeliveryStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DeleteDeliveryStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DeleteDeliveryStreamCommand");
var se_DescribeDeliveryStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DescribeDeliveryStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DescribeDeliveryStreamCommand");
var se_ListDeliveryStreamsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("ListDeliveryStreams");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_ListDeliveryStreamsCommand");
var se_ListTagsForDeliveryStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("ListTagsForDeliveryStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_ListTagsForDeliveryStreamCommand");
var se_PutRecordCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("PutRecord");
  let body;
  body = JSON.stringify(se_PutRecordInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_PutRecordCommand");
var se_PutRecordBatchCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("PutRecordBatch");
  let body;
  body = JSON.stringify(se_PutRecordBatchInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_PutRecordBatchCommand");
var se_StartDeliveryStreamEncryptionCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("StartDeliveryStreamEncryption");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_StartDeliveryStreamEncryptionCommand");
var se_StopDeliveryStreamEncryptionCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("StopDeliveryStreamEncryption");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_StopDeliveryStreamEncryptionCommand");
var se_TagDeliveryStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("TagDeliveryStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_TagDeliveryStreamCommand");
var se_UntagDeliveryStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("UntagDeliveryStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_UntagDeliveryStreamCommand");
var se_UpdateDestinationCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("UpdateDestination");
  let body;
  body = JSON.stringify(se_UpdateDestinationInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_UpdateDestinationCommand");
var de_CreateDeliveryStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_CreateDeliveryStreamCommand");
var de_DeleteDeliveryStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_DeleteDeliveryStreamCommand");
var de_DescribeDeliveryStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_DescribeDeliveryStreamOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_DescribeDeliveryStreamCommand");
var de_ListDeliveryStreamsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_ListDeliveryStreamsCommand");
var de_ListTagsForDeliveryStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_ListTagsForDeliveryStreamCommand");
var de_PutRecordCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_PutRecordCommand");
var de_PutRecordBatchCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_PutRecordBatchCommand");
var de_StartDeliveryStreamEncryptionCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_StartDeliveryStreamEncryptionCommand");
var de_StopDeliveryStreamEncryptionCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_StopDeliveryStreamEncryptionCommand");
var de_TagDeliveryStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_TagDeliveryStreamCommand");
var de_UntagDeliveryStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_UntagDeliveryStreamCommand");
var de_UpdateDestinationCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = (0, import_smithy_client._json)(data);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_UpdateDestinationCommand");
var de_CommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonErrorBody)(output.body, context)
  };
  const errorCode = (0, import_core2.loadRestJsonErrorCode)(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidArgumentException":
    case "com.amazonaws.firehose#InvalidArgumentException":
      throw await de_InvalidArgumentExceptionRes(parsedOutput, context);
    case "InvalidKMSResourceException":
    case "com.amazonaws.firehose#InvalidKMSResourceException":
      throw await de_InvalidKMSResourceExceptionRes(parsedOutput, context);
    case "LimitExceededException":
    case "com.amazonaws.firehose#LimitExceededException":
      throw await de_LimitExceededExceptionRes(parsedOutput, context);
    case "ResourceInUseException":
    case "com.amazonaws.firehose#ResourceInUseException":
      throw await de_ResourceInUseExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.firehose#ResourceNotFoundException":
      throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "InvalidSourceException":
    case "com.amazonaws.firehose#InvalidSourceException":
      throw await de_InvalidSourceExceptionRes(parsedOutput, context);
    case "ServiceUnavailableException":
    case "com.amazonaws.firehose#ServiceUnavailableException":
      throw await de_ServiceUnavailableExceptionRes(parsedOutput, context);
    case "ConcurrentModificationException":
    case "com.amazonaws.firehose#ConcurrentModificationException":
      throw await de_ConcurrentModificationExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_CommandError");
var de_ConcurrentModificationExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ConcurrentModificationException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ConcurrentModificationExceptionRes");
var de_InvalidArgumentExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new InvalidArgumentException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_InvalidArgumentExceptionRes");
var de_InvalidKMSResourceExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new InvalidKMSResourceException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_InvalidKMSResourceExceptionRes");
var de_InvalidSourceExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new InvalidSourceException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_InvalidSourceExceptionRes");
var de_LimitExceededExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new LimitExceededException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_LimitExceededExceptionRes");
var de_ResourceInUseExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ResourceInUseException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ResourceInUseExceptionRes");
var de_ResourceNotFoundExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ResourceNotFoundException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ResourceNotFoundExceptionRes");
var de_ServiceUnavailableExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ServiceUnavailableException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ServiceUnavailableExceptionRes");
var se_CreateDeliveryStreamInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    AmazonOpenSearchServerlessDestinationConfiguration: import_smithy_client._json,
    AmazonopensearchserviceDestinationConfiguration: import_smithy_client._json,
    DeliveryStreamEncryptionConfigurationInput: import_smithy_client._json,
    DeliveryStreamName: [],
    DeliveryStreamType: [],
    ElasticsearchDestinationConfiguration: import_smithy_client._json,
    ExtendedS3DestinationConfiguration: (_) => se_ExtendedS3DestinationConfiguration(_, context),
    HttpEndpointDestinationConfiguration: import_smithy_client._json,
    IcebergDestinationConfiguration: import_smithy_client._json,
    KinesisStreamSourceConfiguration: import_smithy_client._json,
    MSKSourceConfiguration: (_) => se_MSKSourceConfiguration(_, context),
    RedshiftDestinationConfiguration: import_smithy_client._json,
    S3DestinationConfiguration: import_smithy_client._json,
    SnowflakeDestinationConfiguration: import_smithy_client._json,
    SplunkDestinationConfiguration: import_smithy_client._json,
    Tags: import_smithy_client._json
  });
}, "se_CreateDeliveryStreamInput");
var se_DataFormatConversionConfiguration = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    Enabled: [],
    InputFormatConfiguration: import_smithy_client._json,
    OutputFormatConfiguration: (_) => se_OutputFormatConfiguration(_, context),
    SchemaConfiguration: import_smithy_client._json
  });
}, "se_DataFormatConversionConfiguration");
var se_ExtendedS3DestinationConfiguration = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    BucketARN: [],
    BufferingHints: import_smithy_client._json,
    CloudWatchLoggingOptions: import_smithy_client._json,
    CompressionFormat: [],
    CustomTimeZone: [],
    DataFormatConversionConfiguration: (_) => se_DataFormatConversionConfiguration(_, context),
    DynamicPartitioningConfiguration: import_smithy_client._json,
    EncryptionConfiguration: import_smithy_client._json,
    ErrorOutputPrefix: [],
    FileExtension: [],
    Prefix: [],
    ProcessingConfiguration: import_smithy_client._json,
    RoleARN: [],
    S3BackupConfiguration: import_smithy_client._json,
    S3BackupMode: []
  });
}, "se_ExtendedS3DestinationConfiguration");
var se_ExtendedS3DestinationUpdate = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    BucketARN: [],
    BufferingHints: import_smithy_client._json,
    CloudWatchLoggingOptions: import_smithy_client._json,
    CompressionFormat: [],
    CustomTimeZone: [],
    DataFormatConversionConfiguration: (_) => se_DataFormatConversionConfiguration(_, context),
    DynamicPartitioningConfiguration: import_smithy_client._json,
    EncryptionConfiguration: import_smithy_client._json,
    ErrorOutputPrefix: [],
    FileExtension: [],
    Prefix: [],
    ProcessingConfiguration: import_smithy_client._json,
    RoleARN: [],
    S3BackupMode: [],
    S3BackupUpdate: import_smithy_client._json
  });
}, "se_ExtendedS3DestinationUpdate");
var se_MSKSourceConfiguration = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    AuthenticationConfiguration: import_smithy_client._json,
    MSKClusterARN: [],
    ReadFromTimestamp: (_) => _.getTime() / 1e3,
    TopicName: []
  });
}, "se_MSKSourceConfiguration");
var se_OrcSerDe = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    BlockSizeBytes: [],
    BloomFilterColumns: import_smithy_client._json,
    BloomFilterFalsePositiveProbability: import_smithy_client.serializeFloat,
    Compression: [],
    DictionaryKeyThreshold: import_smithy_client.serializeFloat,
    EnablePadding: [],
    FormatVersion: [],
    PaddingTolerance: import_smithy_client.serializeFloat,
    RowIndexStride: [],
    StripeSizeBytes: []
  });
}, "se_OrcSerDe");
var se_OutputFormatConfiguration = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    Serializer: (_) => se_Serializer(_, context)
  });
}, "se_OutputFormatConfiguration");
var se_PutRecordBatchInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    DeliveryStreamName: [],
    Records: (_) => se_PutRecordBatchRequestEntryList(_, context)
  });
}, "se_PutRecordBatchInput");
var se_PutRecordBatchRequestEntryList = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e) => e != null).map((entry) => {
    return se__Record(entry, context);
  });
}, "se_PutRecordBatchRequestEntryList");
var se_PutRecordInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    DeliveryStreamName: [],
    Record: (_) => se__Record(_, context)
  });
}, "se_PutRecordInput");
var se__Record = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    Data: context.base64Encoder
  });
}, "se__Record");
var se_Serializer = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    OrcSerDe: (_) => se_OrcSerDe(_, context),
    ParquetSerDe: import_smithy_client._json
  });
}, "se_Serializer");
var se_UpdateDestinationInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    AmazonOpenSearchServerlessDestinationUpdate: import_smithy_client._json,
    AmazonopensearchserviceDestinationUpdate: import_smithy_client._json,
    CurrentDeliveryStreamVersionId: [],
    DeliveryStreamName: [],
    DestinationId: [],
    ElasticsearchDestinationUpdate: import_smithy_client._json,
    ExtendedS3DestinationUpdate: (_) => se_ExtendedS3DestinationUpdate(_, context),
    HttpEndpointDestinationUpdate: import_smithy_client._json,
    IcebergDestinationUpdate: import_smithy_client._json,
    RedshiftDestinationUpdate: import_smithy_client._json,
    S3DestinationUpdate: import_smithy_client._json,
    SnowflakeDestinationUpdate: import_smithy_client._json,
    SplunkDestinationUpdate: import_smithy_client._json
  });
}, "se_UpdateDestinationInput");
var de_DataFormatConversionConfiguration = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    Enabled: import_smithy_client.expectBoolean,
    InputFormatConfiguration: import_smithy_client._json,
    OutputFormatConfiguration: (_) => de_OutputFormatConfiguration(_, context),
    SchemaConfiguration: import_smithy_client._json
  });
}, "de_DataFormatConversionConfiguration");
var de_DeliveryStreamDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    CreateTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    DeliveryStreamARN: import_smithy_client.expectString,
    DeliveryStreamEncryptionConfiguration: import_smithy_client._json,
    DeliveryStreamName: import_smithy_client.expectString,
    DeliveryStreamStatus: import_smithy_client.expectString,
    DeliveryStreamType: import_smithy_client.expectString,
    Destinations: (_) => de_DestinationDescriptionList(_, context),
    FailureDescription: import_smithy_client._json,
    HasMoreDestinations: import_smithy_client.expectBoolean,
    LastUpdateTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    Source: (_) => de_SourceDescription(_, context),
    VersionId: import_smithy_client.expectString
  });
}, "de_DeliveryStreamDescription");
var de_DescribeDeliveryStreamOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    DeliveryStreamDescription: (_) => de_DeliveryStreamDescription(_, context)
  });
}, "de_DescribeDeliveryStreamOutput");
var de_DestinationDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    AmazonOpenSearchServerlessDestinationDescription: import_smithy_client._json,
    AmazonopensearchserviceDestinationDescription: import_smithy_client._json,
    DestinationId: import_smithy_client.expectString,
    ElasticsearchDestinationDescription: import_smithy_client._json,
    ExtendedS3DestinationDescription: (_) => de_ExtendedS3DestinationDescription(_, context),
    HttpEndpointDestinationDescription: import_smithy_client._json,
    IcebergDestinationDescription: import_smithy_client._json,
    RedshiftDestinationDescription: import_smithy_client._json,
    S3DestinationDescription: import_smithy_client._json,
    SnowflakeDestinationDescription: import_smithy_client._json,
    SplunkDestinationDescription: import_smithy_client._json
  });
}, "de_DestinationDescription");
var de_DestinationDescriptionList = /* @__PURE__ */ __name((output, context) => {
  const retVal = (output || []).filter((e) => e != null).map((entry) => {
    return de_DestinationDescription(entry, context);
  });
  return retVal;
}, "de_DestinationDescriptionList");
var de_ExtendedS3DestinationDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    BucketARN: import_smithy_client.expectString,
    BufferingHints: import_smithy_client._json,
    CloudWatchLoggingOptions: import_smithy_client._json,
    CompressionFormat: import_smithy_client.expectString,
    CustomTimeZone: import_smithy_client.expectString,
    DataFormatConversionConfiguration: (_) => de_DataFormatConversionConfiguration(_, context),
    DynamicPartitioningConfiguration: import_smithy_client._json,
    EncryptionConfiguration: import_smithy_client._json,
    ErrorOutputPrefix: import_smithy_client.expectString,
    FileExtension: import_smithy_client.expectString,
    Prefix: import_smithy_client.expectString,
    ProcessingConfiguration: import_smithy_client._json,
    RoleARN: import_smithy_client.expectString,
    S3BackupDescription: import_smithy_client._json,
    S3BackupMode: import_smithy_client.expectString
  });
}, "de_ExtendedS3DestinationDescription");
var de_KinesisStreamSourceDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    DeliveryStartTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    KinesisStreamARN: import_smithy_client.expectString,
    RoleARN: import_smithy_client.expectString
  });
}, "de_KinesisStreamSourceDescription");
var de_MSKSourceDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    AuthenticationConfiguration: import_smithy_client._json,
    DeliveryStartTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    MSKClusterARN: import_smithy_client.expectString,
    ReadFromTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    TopicName: import_smithy_client.expectString
  });
}, "de_MSKSourceDescription");
var de_OrcSerDe = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    BlockSizeBytes: import_smithy_client.expectInt32,
    BloomFilterColumns: import_smithy_client._json,
    BloomFilterFalsePositiveProbability: import_smithy_client.limitedParseDouble,
    Compression: import_smithy_client.expectString,
    DictionaryKeyThreshold: import_smithy_client.limitedParseDouble,
    EnablePadding: import_smithy_client.expectBoolean,
    FormatVersion: import_smithy_client.expectString,
    PaddingTolerance: import_smithy_client.limitedParseDouble,
    RowIndexStride: import_smithy_client.expectInt32,
    StripeSizeBytes: import_smithy_client.expectInt32
  });
}, "de_OrcSerDe");
var de_OutputFormatConfiguration = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    Serializer: (_) => de_Serializer(_, context)
  });
}, "de_OutputFormatConfiguration");
var de_Serializer = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    OrcSerDe: (_) => de_OrcSerDe(_, context),
    ParquetSerDe: import_smithy_client._json
  });
}, "de_Serializer");
var de_SourceDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    KinesisStreamSourceDescription: (_) => de_KinesisStreamSourceDescription(_, context),
    MSKSourceDescription: (_) => de_MSKSourceDescription(_, context)
  });
}, "de_SourceDescription");
var deserializeMetadata = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var throwDefaultError = (0, import_smithy_client.withBaseException)(FirehoseServiceException);
var buildHttpRpcRequest = /* @__PURE__ */ __name(async (context, headers, path, resolvedHostname, body) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
    headers
  };
  if (resolvedHostname !== void 0) {
    contents.hostname = resolvedHostname;
  }
  if (body !== void 0) {
    contents.body = body;
  }
  return new import_protocol_http.HttpRequest(contents);
}, "buildHttpRpcRequest");
function sharedHeaders(operation) {
  return {
    "content-type": "application/x-amz-json-1.1",
    "x-amz-target": `Firehose_20150804.${operation}`
  };
}
__name(sharedHeaders, "sharedHeaders");

// src/commands/CreateDeliveryStreamCommand.ts
var _CreateDeliveryStreamCommand = class _CreateDeliveryStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "CreateDeliveryStream", {}).n("FirehoseClient", "CreateDeliveryStreamCommand").f(CreateDeliveryStreamInputFilterSensitiveLog, void 0).ser(se_CreateDeliveryStreamCommand).de(de_CreateDeliveryStreamCommand).build() {
};
__name(_CreateDeliveryStreamCommand, "CreateDeliveryStreamCommand");
var CreateDeliveryStreamCommand = _CreateDeliveryStreamCommand;

// src/commands/DeleteDeliveryStreamCommand.ts



var _DeleteDeliveryStreamCommand = class _DeleteDeliveryStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "DeleteDeliveryStream", {}).n("FirehoseClient", "DeleteDeliveryStreamCommand").f(void 0, void 0).ser(se_DeleteDeliveryStreamCommand).de(de_DeleteDeliveryStreamCommand).build() {
};
__name(_DeleteDeliveryStreamCommand, "DeleteDeliveryStreamCommand");
var DeleteDeliveryStreamCommand = _DeleteDeliveryStreamCommand;

// src/commands/DescribeDeliveryStreamCommand.ts



var _DescribeDeliveryStreamCommand = class _DescribeDeliveryStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "DescribeDeliveryStream", {}).n("FirehoseClient", "DescribeDeliveryStreamCommand").f(void 0, DescribeDeliveryStreamOutputFilterSensitiveLog).ser(se_DescribeDeliveryStreamCommand).de(de_DescribeDeliveryStreamCommand).build() {
};
__name(_DescribeDeliveryStreamCommand, "DescribeDeliveryStreamCommand");
var DescribeDeliveryStreamCommand = _DescribeDeliveryStreamCommand;

// src/commands/ListDeliveryStreamsCommand.ts



var _ListDeliveryStreamsCommand = class _ListDeliveryStreamsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "ListDeliveryStreams", {}).n("FirehoseClient", "ListDeliveryStreamsCommand").f(void 0, void 0).ser(se_ListDeliveryStreamsCommand).de(de_ListDeliveryStreamsCommand).build() {
};
__name(_ListDeliveryStreamsCommand, "ListDeliveryStreamsCommand");
var ListDeliveryStreamsCommand = _ListDeliveryStreamsCommand;

// src/commands/ListTagsForDeliveryStreamCommand.ts



var _ListTagsForDeliveryStreamCommand = class _ListTagsForDeliveryStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "ListTagsForDeliveryStream", {}).n("FirehoseClient", "ListTagsForDeliveryStreamCommand").f(void 0, void 0).ser(se_ListTagsForDeliveryStreamCommand).de(de_ListTagsForDeliveryStreamCommand).build() {
};
__name(_ListTagsForDeliveryStreamCommand, "ListTagsForDeliveryStreamCommand");
var ListTagsForDeliveryStreamCommand = _ListTagsForDeliveryStreamCommand;

// src/commands/PutRecordBatchCommand.ts



var _PutRecordBatchCommand = class _PutRecordBatchCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "PutRecordBatch", {}).n("FirehoseClient", "PutRecordBatchCommand").f(void 0, void 0).ser(se_PutRecordBatchCommand).de(de_PutRecordBatchCommand).build() {
};
__name(_PutRecordBatchCommand, "PutRecordBatchCommand");
var PutRecordBatchCommand = _PutRecordBatchCommand;

// src/commands/PutRecordCommand.ts



var _PutRecordCommand = class _PutRecordCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "PutRecord", {}).n("FirehoseClient", "PutRecordCommand").f(void 0, void 0).ser(se_PutRecordCommand).de(de_PutRecordCommand).build() {
};
__name(_PutRecordCommand, "PutRecordCommand");
var PutRecordCommand = _PutRecordCommand;

// src/commands/StartDeliveryStreamEncryptionCommand.ts



var _StartDeliveryStreamEncryptionCommand = class _StartDeliveryStreamEncryptionCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "StartDeliveryStreamEncryption", {}).n("FirehoseClient", "StartDeliveryStreamEncryptionCommand").f(void 0, void 0).ser(se_StartDeliveryStreamEncryptionCommand).de(de_StartDeliveryStreamEncryptionCommand).build() {
};
__name(_StartDeliveryStreamEncryptionCommand, "StartDeliveryStreamEncryptionCommand");
var StartDeliveryStreamEncryptionCommand = _StartDeliveryStreamEncryptionCommand;

// src/commands/StopDeliveryStreamEncryptionCommand.ts



var _StopDeliveryStreamEncryptionCommand = class _StopDeliveryStreamEncryptionCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "StopDeliveryStreamEncryption", {}).n("FirehoseClient", "StopDeliveryStreamEncryptionCommand").f(void 0, void 0).ser(se_StopDeliveryStreamEncryptionCommand).de(de_StopDeliveryStreamEncryptionCommand).build() {
};
__name(_StopDeliveryStreamEncryptionCommand, "StopDeliveryStreamEncryptionCommand");
var StopDeliveryStreamEncryptionCommand = _StopDeliveryStreamEncryptionCommand;

// src/commands/TagDeliveryStreamCommand.ts



var _TagDeliveryStreamCommand = class _TagDeliveryStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "TagDeliveryStream", {}).n("FirehoseClient", "TagDeliveryStreamCommand").f(void 0, void 0).ser(se_TagDeliveryStreamCommand).de(de_TagDeliveryStreamCommand).build() {
};
__name(_TagDeliveryStreamCommand, "TagDeliveryStreamCommand");
var TagDeliveryStreamCommand = _TagDeliveryStreamCommand;

// src/commands/UntagDeliveryStreamCommand.ts



var _UntagDeliveryStreamCommand = class _UntagDeliveryStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "UntagDeliveryStream", {}).n("FirehoseClient", "UntagDeliveryStreamCommand").f(void 0, void 0).ser(se_UntagDeliveryStreamCommand).de(de_UntagDeliveryStreamCommand).build() {
};
__name(_UntagDeliveryStreamCommand, "UntagDeliveryStreamCommand");
var UntagDeliveryStreamCommand = _UntagDeliveryStreamCommand;

// src/commands/UpdateDestinationCommand.ts



var _UpdateDestinationCommand = class _UpdateDestinationCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Firehose_20150804", "UpdateDestination", {}).n("FirehoseClient", "UpdateDestinationCommand").f(UpdateDestinationInputFilterSensitiveLog, void 0).ser(se_UpdateDestinationCommand).de(de_UpdateDestinationCommand).build() {
};
__name(_UpdateDestinationCommand, "UpdateDestinationCommand");
var UpdateDestinationCommand = _UpdateDestinationCommand;

// src/Firehose.ts
var commands = {
  CreateDeliveryStreamCommand,
  DeleteDeliveryStreamCommand,
  DescribeDeliveryStreamCommand,
  ListDeliveryStreamsCommand,
  ListTagsForDeliveryStreamCommand,
  PutRecordCommand,
  PutRecordBatchCommand,
  StartDeliveryStreamEncryptionCommand,
  StopDeliveryStreamEncryptionCommand,
  TagDeliveryStreamCommand,
  UntagDeliveryStreamCommand,
  UpdateDestinationCommand
};
var _Firehose = class _Firehose extends FirehoseClient {
};
__name(_Firehose, "Firehose");
var Firehose = _Firehose;
(0, import_smithy_client.createAggregatedClient)(commands, Firehose);
// Annotate the CommonJS export names for ESM import in node:

0 && (module.exports = {
  FirehoseServiceException,
  __Client,
  FirehoseClient,
  Firehose,
  $Command,
  CreateDeliveryStreamCommand,
  DeleteDeliveryStreamCommand,
  DescribeDeliveryStreamCommand,
  ListDeliveryStreamsCommand,
  ListTagsForDeliveryStreamCommand,
  PutRecordBatchCommand,
  PutRecordCommand,
  StartDeliveryStreamEncryptionCommand,
  StopDeliveryStreamEncryptionCommand,
  TagDeliveryStreamCommand,
  UntagDeliveryStreamCommand,
  UpdateDestinationCommand,
  ProcessorParameterName,
  ProcessorType,
  AmazonOpenSearchServerlessS3BackupMode,
  CompressionFormat,
  NoEncryptionConfig,
  DefaultDocumentIdFormat,
  AmazonopensearchserviceIndexRotationPeriod,
  AmazonopensearchserviceS3BackupMode,
  Connectivity,
  ConcurrentModificationException,
  ContentEncoding,
  KeyType,
  DeliveryStreamType,
  ElasticsearchIndexRotationPeriod,
  ElasticsearchS3BackupMode,
  OrcCompression,
  OrcFormatVersion,
  ParquetCompression,
  ParquetWriterVersion,
  S3BackupMode,
  HttpEndpointS3BackupMode,
  IcebergS3BackupMode,
  RedshiftS3BackupMode,
  SnowflakeDataLoadingOption,
  SnowflakeS3BackupMode,
  HECEndpointType,
  SplunkS3BackupMode,
  InvalidArgumentException,
  InvalidKMSResourceException,
  LimitExceededException,
  ResourceInUseException,
  ResourceNotFoundException,
  DeliveryStreamFailureType,
  DeliveryStreamEncryptionStatus,
  DeliveryStreamStatus,
  InvalidSourceException,
  ServiceUnavailableException,
  HttpEndpointConfigurationFilterSensitiveLog,
  HttpEndpointCommonAttributeFilterSensitiveLog,
  HttpEndpointRequestConfigurationFilterSensitiveLog,
  HttpEndpointDestinationConfigurationFilterSensitiveLog,
  RedshiftDestinationConfigurationFilterSensitiveLog,
  SnowflakeRoleConfigurationFilterSensitiveLog,
  SnowflakeVpcConfigurationFilterSensitiveLog,
  SnowflakeDestinationConfigurationFilterSensitiveLog,
  CreateDeliveryStreamInputFilterSensitiveLog,
  HttpEndpointDescriptionFilterSensitiveLog,
  HttpEndpointDestinationDescriptionFilterSensitiveLog,
  RedshiftDestinationDescriptionFilterSensitiveLog,
  SnowflakeDestinationDescriptionFilterSensitiveLog,
  DestinationDescriptionFilterSensitiveLog,
  DeliveryStreamDescriptionFilterSensitiveLog,
  DescribeDeliveryStreamOutputFilterSensitiveLog,
  HttpEndpointDestinationUpdateFilterSensitiveLog,
  RedshiftDestinationUpdateFilterSensitiveLog,
  SnowflakeDestinationUpdateFilterSensitiveLog,
  UpdateDestinationInputFilterSensitiveLog
});

