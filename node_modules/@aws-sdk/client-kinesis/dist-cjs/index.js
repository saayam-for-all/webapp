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
  AccessDeniedException: () => AccessDeniedException,
  AddTagsToStreamCommand: () => AddTagsToStreamCommand,
  ConsumerStatus: () => ConsumerStatus,
  CreateStreamCommand: () => CreateStreamCommand,
  DecreaseStreamRetentionPeriodCommand: () => DecreaseStreamRetentionPeriodCommand,
  DeleteResourcePolicyCommand: () => DeleteResourcePolicyCommand,
  DeleteStreamCommand: () => DeleteStreamCommand,
  DeregisterStreamConsumerCommand: () => DeregisterStreamConsumerCommand,
  DescribeLimitsCommand: () => DescribeLimitsCommand,
  DescribeStreamCommand: () => DescribeStreamCommand,
  DescribeStreamConsumerCommand: () => DescribeStreamConsumerCommand,
  DescribeStreamSummaryCommand: () => DescribeStreamSummaryCommand,
  DisableEnhancedMonitoringCommand: () => DisableEnhancedMonitoringCommand,
  EnableEnhancedMonitoringCommand: () => EnableEnhancedMonitoringCommand,
  EncryptionType: () => EncryptionType,
  ExpiredIteratorException: () => ExpiredIteratorException,
  ExpiredNextTokenException: () => ExpiredNextTokenException,
  GetRecordsCommand: () => GetRecordsCommand,
  GetResourcePolicyCommand: () => GetResourcePolicyCommand,
  GetShardIteratorCommand: () => GetShardIteratorCommand,
  IncreaseStreamRetentionPeriodCommand: () => IncreaseStreamRetentionPeriodCommand,
  InternalFailureException: () => InternalFailureException,
  InvalidArgumentException: () => InvalidArgumentException,
  KMSAccessDeniedException: () => KMSAccessDeniedException,
  KMSDisabledException: () => KMSDisabledException,
  KMSInvalidStateException: () => KMSInvalidStateException,
  KMSNotFoundException: () => KMSNotFoundException,
  KMSOptInRequired: () => KMSOptInRequired,
  KMSThrottlingException: () => KMSThrottlingException,
  Kinesis: () => Kinesis,
  KinesisClient: () => KinesisClient,
  KinesisServiceException: () => KinesisServiceException,
  LimitExceededException: () => LimitExceededException,
  ListShardsCommand: () => ListShardsCommand,
  ListStreamConsumersCommand: () => ListStreamConsumersCommand,
  ListStreamsCommand: () => ListStreamsCommand,
  ListTagsForStreamCommand: () => ListTagsForStreamCommand,
  MergeShardsCommand: () => MergeShardsCommand,
  MetricsName: () => MetricsName,
  ProvisionedThroughputExceededException: () => ProvisionedThroughputExceededException,
  PutRecordCommand: () => PutRecordCommand,
  PutRecordsCommand: () => PutRecordsCommand,
  PutResourcePolicyCommand: () => PutResourcePolicyCommand,
  RegisterStreamConsumerCommand: () => RegisterStreamConsumerCommand,
  RemoveTagsFromStreamCommand: () => RemoveTagsFromStreamCommand,
  ResourceInUseException: () => ResourceInUseException,
  ResourceNotFoundException: () => ResourceNotFoundException,
  ScalingType: () => ScalingType,
  ShardFilterType: () => ShardFilterType,
  ShardIteratorType: () => ShardIteratorType,
  SplitShardCommand: () => SplitShardCommand,
  StartStreamEncryptionCommand: () => StartStreamEncryptionCommand,
  StopStreamEncryptionCommand: () => StopStreamEncryptionCommand,
  StreamMode: () => StreamMode,
  StreamStatus: () => StreamStatus,
  SubscribeToShardCommand: () => SubscribeToShardCommand,
  SubscribeToShardEventStream: () => SubscribeToShardEventStream,
  SubscribeToShardEventStreamFilterSensitiveLog: () => SubscribeToShardEventStreamFilterSensitiveLog,
  SubscribeToShardOutputFilterSensitiveLog: () => SubscribeToShardOutputFilterSensitiveLog,
  UpdateShardCountCommand: () => UpdateShardCountCommand,
  UpdateStreamModeCommand: () => UpdateStreamModeCommand,
  ValidationException: () => ValidationException,
  __Client: () => import_smithy_client.Client,
  paginateListStreamConsumers: () => paginateListStreamConsumers,
  paginateListStreams: () => paginateListStreams,
  waitForStreamExists: () => waitForStreamExists,
  waitForStreamNotExists: () => waitForStreamNotExists,
  waitUntilStreamExists: () => waitUntilStreamExists,
  waitUntilStreamNotExists: () => waitUntilStreamNotExists
});
module.exports = __toCommonJS(src_exports);

// src/KinesisClient.ts
var import_middleware_host_header = require("@aws-sdk/middleware-host-header");
var import_middleware_logger = require("@aws-sdk/middleware-logger");
var import_middleware_recursion_detection = require("@aws-sdk/middleware-recursion-detection");
var import_middleware_user_agent = require("@aws-sdk/middleware-user-agent");
var import_config_resolver = require("@smithy/config-resolver");
var import_core = require("@smithy/core");
var import_eventstream_serde_config_resolver = require("@smithy/eventstream-serde-config-resolver");
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
    defaultSigningName: "kinesis"
  };
}, "resolveClientEndpointParameters");
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// src/KinesisClient.ts
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

// src/KinesisClient.ts
var _KinesisClient = class _KinesisClient extends import_smithy_client.Client {
  constructor(...[configuration]) {
    const _config_0 = (0, import_runtimeConfig.getRuntimeConfig)(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = (0, import_config_resolver.resolveRegionConfig)(_config_1);
    const _config_3 = (0, import_middleware_endpoint.resolveEndpointConfig)(_config_2);
    const _config_4 = (0, import_middleware_host_header.resolveHostHeaderConfig)(_config_3);
    const _config_5 = (0, import_middleware_user_agent.resolveUserAgentConfig)(_config_4);
    const _config_6 = (0, import_middleware_retry.resolveRetryConfig)(_config_5);
    const _config_7 = (0, import_eventstream_serde_config_resolver.resolveEventStreamSerdeConfig)(_config_6);
    const _config_8 = (0, import_httpAuthSchemeProvider.resolveHttpAuthSchemeConfig)(_config_7);
    const _config_9 = resolveRuntimeExtensions(_config_8, (configuration == null ? void 0 : configuration.extensions) || []);
    super(_config_9);
    this.config = _config_9;
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
    return import_httpAuthSchemeProvider.defaultKinesisHttpAuthSchemeParametersProvider;
  }
  getIdentityProviderConfigProvider() {
    return async (config) => new import_core.DefaultIdentityProviderConfig({
      "aws.auth#sigv4": config.credentials
    });
  }
};
__name(_KinesisClient, "KinesisClient");
var KinesisClient = _KinesisClient;

// src/Kinesis.ts


// src/commands/AddTagsToStreamCommand.ts

var import_middleware_serde = require("@smithy/middleware-serde");


// src/protocols/Aws_json1_1.ts
var import_core2 = require("@aws-sdk/core");



// src/models/KinesisServiceException.ts

var _KinesisServiceException = class _KinesisServiceException extends import_smithy_client.ServiceException {
  /**
   * @internal
   */
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _KinesisServiceException.prototype);
  }
};
__name(_KinesisServiceException, "KinesisServiceException");
var KinesisServiceException = _KinesisServiceException;

// src/models/models_0.ts
var _AccessDeniedException = class _AccessDeniedException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "AccessDeniedException",
      $fault: "client",
      ...opts
    });
    this.name = "AccessDeniedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AccessDeniedException.prototype);
  }
};
__name(_AccessDeniedException, "AccessDeniedException");
var AccessDeniedException = _AccessDeniedException;
var _InvalidArgumentException = class _InvalidArgumentException extends KinesisServiceException {
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
var _LimitExceededException = class _LimitExceededException extends KinesisServiceException {
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
var _ResourceInUseException = class _ResourceInUseException extends KinesisServiceException {
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
var _ResourceNotFoundException = class _ResourceNotFoundException extends KinesisServiceException {
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
var ConsumerStatus = {
  ACTIVE: "ACTIVE",
  CREATING: "CREATING",
  DELETING: "DELETING"
};
var StreamMode = {
  ON_DEMAND: "ON_DEMAND",
  PROVISIONED: "PROVISIONED"
};
var EncryptionType = {
  KMS: "KMS",
  NONE: "NONE"
};
var MetricsName = {
  ALL: "ALL",
  INCOMING_BYTES: "IncomingBytes",
  INCOMING_RECORDS: "IncomingRecords",
  ITERATOR_AGE_MILLISECONDS: "IteratorAgeMilliseconds",
  OUTGOING_BYTES: "OutgoingBytes",
  OUTGOING_RECORDS: "OutgoingRecords",
  READ_PROVISIONED_THROUGHPUT_EXCEEDED: "ReadProvisionedThroughputExceeded",
  WRITE_PROVISIONED_THROUGHPUT_EXCEEDED: "WriteProvisionedThroughputExceeded"
};
var StreamStatus = {
  ACTIVE: "ACTIVE",
  CREATING: "CREATING",
  DELETING: "DELETING",
  UPDATING: "UPDATING"
};
var _ExpiredIteratorException = class _ExpiredIteratorException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ExpiredIteratorException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredIteratorException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExpiredIteratorException.prototype);
  }
};
__name(_ExpiredIteratorException, "ExpiredIteratorException");
var ExpiredIteratorException = _ExpiredIteratorException;
var _ExpiredNextTokenException = class _ExpiredNextTokenException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ExpiredNextTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredNextTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExpiredNextTokenException.prototype);
  }
};
__name(_ExpiredNextTokenException, "ExpiredNextTokenException");
var ExpiredNextTokenException = _ExpiredNextTokenException;
var _KMSAccessDeniedException = class _KMSAccessDeniedException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "KMSAccessDeniedException",
      $fault: "client",
      ...opts
    });
    this.name = "KMSAccessDeniedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSAccessDeniedException.prototype);
  }
};
__name(_KMSAccessDeniedException, "KMSAccessDeniedException");
var KMSAccessDeniedException = _KMSAccessDeniedException;
var _KMSDisabledException = class _KMSDisabledException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "KMSDisabledException",
      $fault: "client",
      ...opts
    });
    this.name = "KMSDisabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSDisabledException.prototype);
  }
};
__name(_KMSDisabledException, "KMSDisabledException");
var KMSDisabledException = _KMSDisabledException;
var _KMSInvalidStateException = class _KMSInvalidStateException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "KMSInvalidStateException",
      $fault: "client",
      ...opts
    });
    this.name = "KMSInvalidStateException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSInvalidStateException.prototype);
  }
};
__name(_KMSInvalidStateException, "KMSInvalidStateException");
var KMSInvalidStateException = _KMSInvalidStateException;
var _KMSNotFoundException = class _KMSNotFoundException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "KMSNotFoundException",
      $fault: "client",
      ...opts
    });
    this.name = "KMSNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSNotFoundException.prototype);
  }
};
__name(_KMSNotFoundException, "KMSNotFoundException");
var KMSNotFoundException = _KMSNotFoundException;
var _KMSOptInRequired = class _KMSOptInRequired extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "KMSOptInRequired",
      $fault: "client",
      ...opts
    });
    this.name = "KMSOptInRequired";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSOptInRequired.prototype);
  }
};
__name(_KMSOptInRequired, "KMSOptInRequired");
var KMSOptInRequired = _KMSOptInRequired;
var _KMSThrottlingException = class _KMSThrottlingException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "KMSThrottlingException",
      $fault: "client",
      ...opts
    });
    this.name = "KMSThrottlingException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _KMSThrottlingException.prototype);
  }
};
__name(_KMSThrottlingException, "KMSThrottlingException");
var KMSThrottlingException = _KMSThrottlingException;
var _ProvisionedThroughputExceededException = class _ProvisionedThroughputExceededException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ProvisionedThroughputExceededException",
      $fault: "client",
      ...opts
    });
    this.name = "ProvisionedThroughputExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ProvisionedThroughputExceededException.prototype);
  }
};
__name(_ProvisionedThroughputExceededException, "ProvisionedThroughputExceededException");
var ProvisionedThroughputExceededException = _ProvisionedThroughputExceededException;
var ShardIteratorType = {
  AFTER_SEQUENCE_NUMBER: "AFTER_SEQUENCE_NUMBER",
  AT_SEQUENCE_NUMBER: "AT_SEQUENCE_NUMBER",
  AT_TIMESTAMP: "AT_TIMESTAMP",
  LATEST: "LATEST",
  TRIM_HORIZON: "TRIM_HORIZON"
};
var _InternalFailureException = class _InternalFailureException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "InternalFailureException",
      $fault: "server",
      ...opts
    });
    this.name = "InternalFailureException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InternalFailureException.prototype);
  }
};
__name(_InternalFailureException, "InternalFailureException");
var InternalFailureException = _InternalFailureException;
var ShardFilterType = {
  AFTER_SHARD_ID: "AFTER_SHARD_ID",
  AT_LATEST: "AT_LATEST",
  AT_TIMESTAMP: "AT_TIMESTAMP",
  AT_TRIM_HORIZON: "AT_TRIM_HORIZON",
  FROM_TIMESTAMP: "FROM_TIMESTAMP",
  FROM_TRIM_HORIZON: "FROM_TRIM_HORIZON"
};
var _ValidationException = class _ValidationException extends KinesisServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "ValidationException",
      $fault: "client",
      ...opts
    });
    this.name = "ValidationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ValidationException.prototype);
  }
};
__name(_ValidationException, "ValidationException");
var ValidationException = _ValidationException;
var SubscribeToShardEventStream;
((SubscribeToShardEventStream3) => {
  SubscribeToShardEventStream3.visit = /* @__PURE__ */ __name((value, visitor) => {
    if (value.SubscribeToShardEvent !== void 0)
      return visitor.SubscribeToShardEvent(value.SubscribeToShardEvent);
    if (value.ResourceNotFoundException !== void 0)
      return visitor.ResourceNotFoundException(value.ResourceNotFoundException);
    if (value.ResourceInUseException !== void 0)
      return visitor.ResourceInUseException(value.ResourceInUseException);
    if (value.KMSDisabledException !== void 0)
      return visitor.KMSDisabledException(value.KMSDisabledException);
    if (value.KMSInvalidStateException !== void 0)
      return visitor.KMSInvalidStateException(value.KMSInvalidStateException);
    if (value.KMSAccessDeniedException !== void 0)
      return visitor.KMSAccessDeniedException(value.KMSAccessDeniedException);
    if (value.KMSNotFoundException !== void 0)
      return visitor.KMSNotFoundException(value.KMSNotFoundException);
    if (value.KMSOptInRequired !== void 0)
      return visitor.KMSOptInRequired(value.KMSOptInRequired);
    if (value.KMSThrottlingException !== void 0)
      return visitor.KMSThrottlingException(value.KMSThrottlingException);
    if (value.InternalFailureException !== void 0)
      return visitor.InternalFailureException(value.InternalFailureException);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  }, "visit");
})(SubscribeToShardEventStream || (SubscribeToShardEventStream = {}));
var ScalingType = {
  UNIFORM_SCALING: "UNIFORM_SCALING"
};
var SubscribeToShardEventStreamFilterSensitiveLog = /* @__PURE__ */ __name((obj) => {
  if (obj.SubscribeToShardEvent !== void 0)
    return { SubscribeToShardEvent: obj.SubscribeToShardEvent };
  if (obj.ResourceNotFoundException !== void 0)
    return { ResourceNotFoundException: obj.ResourceNotFoundException };
  if (obj.ResourceInUseException !== void 0)
    return { ResourceInUseException: obj.ResourceInUseException };
  if (obj.KMSDisabledException !== void 0)
    return { KMSDisabledException: obj.KMSDisabledException };
  if (obj.KMSInvalidStateException !== void 0)
    return { KMSInvalidStateException: obj.KMSInvalidStateException };
  if (obj.KMSAccessDeniedException !== void 0)
    return { KMSAccessDeniedException: obj.KMSAccessDeniedException };
  if (obj.KMSNotFoundException !== void 0)
    return { KMSNotFoundException: obj.KMSNotFoundException };
  if (obj.KMSOptInRequired !== void 0)
    return { KMSOptInRequired: obj.KMSOptInRequired };
  if (obj.KMSThrottlingException !== void 0)
    return { KMSThrottlingException: obj.KMSThrottlingException };
  if (obj.InternalFailureException !== void 0)
    return { InternalFailureException: obj.InternalFailureException };
  if (obj.$unknown !== void 0)
    return { [obj.$unknown[0]]: "UNKNOWN" };
}, "SubscribeToShardEventStreamFilterSensitiveLog");
var SubscribeToShardOutputFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.EventStream && { EventStream: "STREAMING_CONTENT" }
}), "SubscribeToShardOutputFilterSensitiveLog");

// src/protocols/Aws_json1_1.ts
var se_AddTagsToStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("AddTagsToStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_AddTagsToStreamCommand");
var se_CreateStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("CreateStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_CreateStreamCommand");
var se_DecreaseStreamRetentionPeriodCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DecreaseStreamRetentionPeriod");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DecreaseStreamRetentionPeriodCommand");
var se_DeleteResourcePolicyCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DeleteResourcePolicy");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DeleteResourcePolicyCommand");
var se_DeleteStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DeleteStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DeleteStreamCommand");
var se_DeregisterStreamConsumerCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DeregisterStreamConsumer");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DeregisterStreamConsumerCommand");
var se_DescribeLimitsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DescribeLimits");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DescribeLimitsCommand");
var se_DescribeStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DescribeStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DescribeStreamCommand");
var se_DescribeStreamConsumerCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DescribeStreamConsumer");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DescribeStreamConsumerCommand");
var se_DescribeStreamSummaryCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DescribeStreamSummary");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DescribeStreamSummaryCommand");
var se_DisableEnhancedMonitoringCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("DisableEnhancedMonitoring");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_DisableEnhancedMonitoringCommand");
var se_EnableEnhancedMonitoringCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("EnableEnhancedMonitoring");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_EnableEnhancedMonitoringCommand");
var se_GetRecordsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("GetRecords");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_GetRecordsCommand");
var se_GetResourcePolicyCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("GetResourcePolicy");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_GetResourcePolicyCommand");
var se_GetShardIteratorCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("GetShardIterator");
  let body;
  body = JSON.stringify(se_GetShardIteratorInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_GetShardIteratorCommand");
var se_IncreaseStreamRetentionPeriodCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("IncreaseStreamRetentionPeriod");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_IncreaseStreamRetentionPeriodCommand");
var se_ListShardsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("ListShards");
  let body;
  body = JSON.stringify(se_ListShardsInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_ListShardsCommand");
var se_ListStreamConsumersCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("ListStreamConsumers");
  let body;
  body = JSON.stringify(se_ListStreamConsumersInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_ListStreamConsumersCommand");
var se_ListStreamsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("ListStreams");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_ListStreamsCommand");
var se_ListTagsForStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("ListTagsForStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_ListTagsForStreamCommand");
var se_MergeShardsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("MergeShards");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_MergeShardsCommand");
var se_PutRecordCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("PutRecord");
  let body;
  body = JSON.stringify(se_PutRecordInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_PutRecordCommand");
var se_PutRecordsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("PutRecords");
  let body;
  body = JSON.stringify(se_PutRecordsInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_PutRecordsCommand");
var se_PutResourcePolicyCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("PutResourcePolicy");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_PutResourcePolicyCommand");
var se_RegisterStreamConsumerCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("RegisterStreamConsumer");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_RegisterStreamConsumerCommand");
var se_RemoveTagsFromStreamCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("RemoveTagsFromStream");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_RemoveTagsFromStreamCommand");
var se_SplitShardCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("SplitShard");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_SplitShardCommand");
var se_StartStreamEncryptionCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("StartStreamEncryption");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_StartStreamEncryptionCommand");
var se_StopStreamEncryptionCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("StopStreamEncryption");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_StopStreamEncryptionCommand");
var se_SubscribeToShardCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("SubscribeToShard");
  let body;
  body = JSON.stringify(se_SubscribeToShardInput(input, context));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_SubscribeToShardCommand");
var se_UpdateShardCountCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("UpdateShardCount");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_UpdateShardCountCommand");
var se_UpdateStreamModeCommand = /* @__PURE__ */ __name(async (input, context) => {
  const headers = sharedHeaders("UpdateStreamMode");
  let body;
  body = JSON.stringify((0, import_smithy_client._json)(input));
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
}, "se_UpdateStreamModeCommand");
var de_AddTagsToStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_AddTagsToStreamCommand");
var de_CreateStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_CreateStreamCommand");
var de_DecreaseStreamRetentionPeriodCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_DecreaseStreamRetentionPeriodCommand");
var de_DeleteResourcePolicyCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_DeleteResourcePolicyCommand");
var de_DeleteStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_DeleteStreamCommand");
var de_DeregisterStreamConsumerCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_DeregisterStreamConsumerCommand");
var de_DescribeLimitsCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_DescribeLimitsCommand");
var de_DescribeStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_DescribeStreamOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_DescribeStreamCommand");
var de_DescribeStreamConsumerCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_DescribeStreamConsumerOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_DescribeStreamConsumerCommand");
var de_DescribeStreamSummaryCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_DescribeStreamSummaryOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_DescribeStreamSummaryCommand");
var de_DisableEnhancedMonitoringCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_DisableEnhancedMonitoringCommand");
var de_EnableEnhancedMonitoringCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_EnableEnhancedMonitoringCommand");
var de_GetRecordsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_GetRecordsOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_GetRecordsCommand");
var de_GetResourcePolicyCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_GetResourcePolicyCommand");
var de_GetShardIteratorCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_GetShardIteratorCommand");
var de_IncreaseStreamRetentionPeriodCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_IncreaseStreamRetentionPeriodCommand");
var de_ListShardsCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_ListShardsCommand");
var de_ListStreamConsumersCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_ListStreamConsumersOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_ListStreamConsumersCommand");
var de_ListStreamsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_ListStreamsOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_ListStreamsCommand");
var de_ListTagsForStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_ListTagsForStreamCommand");
var de_MergeShardsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_MergeShardsCommand");
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
var de_PutRecordsCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_PutRecordsCommand");
var de_PutResourcePolicyCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_PutResourcePolicyCommand");
var de_RegisterStreamConsumerCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  let contents = {};
  contents = de_RegisterStreamConsumerOutput(data, context);
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_RegisterStreamConsumerCommand");
var de_RemoveTagsFromStreamCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_RemoveTagsFromStreamCommand");
var de_SplitShardCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_SplitShardCommand");
var de_StartStreamEncryptionCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_StartStreamEncryptionCommand");
var de_StopStreamEncryptionCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_StopStreamEncryptionCommand");
var de_SubscribeToShardCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = { EventStream: de_SubscribeToShardEventStream(output.body, context) };
  const response = {
    $metadata: deserializeMetadata(output),
    ...contents
  };
  return response;
}, "de_SubscribeToShardCommand");
var de_UpdateShardCountCommand = /* @__PURE__ */ __name(async (output, context) => {
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
}, "de_UpdateShardCountCommand");
var de_UpdateStreamModeCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  await (0, import_smithy_client.collectBody)(output.body, context);
  const response = {
    $metadata: deserializeMetadata(output)
  };
  return response;
}, "de_UpdateStreamModeCommand");
var de_CommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonErrorBody)(output.body, context)
  };
  const errorCode = (0, import_core2.loadRestJsonErrorCode)(output, parsedOutput.body);
  switch (errorCode) {
    case "AccessDeniedException":
    case "com.amazonaws.kinesis#AccessDeniedException":
      throw await de_AccessDeniedExceptionRes(parsedOutput, context);
    case "InvalidArgumentException":
    case "com.amazonaws.kinesis#InvalidArgumentException":
      throw await de_InvalidArgumentExceptionRes(parsedOutput, context);
    case "LimitExceededException":
    case "com.amazonaws.kinesis#LimitExceededException":
      throw await de_LimitExceededExceptionRes(parsedOutput, context);
    case "ResourceInUseException":
    case "com.amazonaws.kinesis#ResourceInUseException":
      throw await de_ResourceInUseExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.kinesis#ResourceNotFoundException":
      throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "ExpiredIteratorException":
    case "com.amazonaws.kinesis#ExpiredIteratorException":
      throw await de_ExpiredIteratorExceptionRes(parsedOutput, context);
    case "KMSAccessDeniedException":
    case "com.amazonaws.kinesis#KMSAccessDeniedException":
      throw await de_KMSAccessDeniedExceptionRes(parsedOutput, context);
    case "KMSDisabledException":
    case "com.amazonaws.kinesis#KMSDisabledException":
      throw await de_KMSDisabledExceptionRes(parsedOutput, context);
    case "KMSInvalidStateException":
    case "com.amazonaws.kinesis#KMSInvalidStateException":
      throw await de_KMSInvalidStateExceptionRes(parsedOutput, context);
    case "KMSNotFoundException":
    case "com.amazonaws.kinesis#KMSNotFoundException":
      throw await de_KMSNotFoundExceptionRes(parsedOutput, context);
    case "KMSOptInRequired":
    case "com.amazonaws.kinesis#KMSOptInRequired":
      throw await de_KMSOptInRequiredRes(parsedOutput, context);
    case "KMSThrottlingException":
    case "com.amazonaws.kinesis#KMSThrottlingException":
      throw await de_KMSThrottlingExceptionRes(parsedOutput, context);
    case "ProvisionedThroughputExceededException":
    case "com.amazonaws.kinesis#ProvisionedThroughputExceededException":
      throw await de_ProvisionedThroughputExceededExceptionRes(parsedOutput, context);
    case "ExpiredNextTokenException":
    case "com.amazonaws.kinesis#ExpiredNextTokenException":
      throw await de_ExpiredNextTokenExceptionRes(parsedOutput, context);
    case "ValidationException":
    case "com.amazonaws.kinesis#ValidationException":
      throw await de_ValidationExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_CommandError");
var de_AccessDeniedExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new AccessDeniedException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_AccessDeniedExceptionRes");
var de_ExpiredIteratorExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ExpiredIteratorException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ExpiredIteratorExceptionRes");
var de_ExpiredNextTokenExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ExpiredNextTokenException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ExpiredNextTokenExceptionRes");
var de_InvalidArgumentExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new InvalidArgumentException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_InvalidArgumentExceptionRes");
var de_KMSAccessDeniedExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new KMSAccessDeniedException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_KMSAccessDeniedExceptionRes");
var de_KMSDisabledExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new KMSDisabledException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_KMSDisabledExceptionRes");
var de_KMSInvalidStateExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new KMSInvalidStateException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_KMSInvalidStateExceptionRes");
var de_KMSNotFoundExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new KMSNotFoundException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_KMSNotFoundExceptionRes");
var de_KMSOptInRequiredRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new KMSOptInRequired({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_KMSOptInRequiredRes");
var de_KMSThrottlingExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new KMSThrottlingException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_KMSThrottlingExceptionRes");
var de_LimitExceededExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new LimitExceededException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_LimitExceededExceptionRes");
var de_ProvisionedThroughputExceededExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ProvisionedThroughputExceededException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ProvisionedThroughputExceededExceptionRes");
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
var de_ValidationExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new ValidationException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_ValidationExceptionRes");
var de_SubscribeToShardEventStream = /* @__PURE__ */ __name((output, context) => {
  return context.eventStreamMarshaller.deserialize(output, async (event) => {
    if (event["SubscribeToShardEvent"] != null) {
      return {
        SubscribeToShardEvent: await de_SubscribeToShardEvent_event(event["SubscribeToShardEvent"], context)
      };
    }
    if (event["ResourceNotFoundException"] != null) {
      return {
        ResourceNotFoundException: await de_ResourceNotFoundException_event(
          event["ResourceNotFoundException"],
          context
        )
      };
    }
    if (event["ResourceInUseException"] != null) {
      return {
        ResourceInUseException: await de_ResourceInUseException_event(event["ResourceInUseException"], context)
      };
    }
    if (event["KMSDisabledException"] != null) {
      return {
        KMSDisabledException: await de_KMSDisabledException_event(event["KMSDisabledException"], context)
      };
    }
    if (event["KMSInvalidStateException"] != null) {
      return {
        KMSInvalidStateException: await de_KMSInvalidStateException_event(event["KMSInvalidStateException"], context)
      };
    }
    if (event["KMSAccessDeniedException"] != null) {
      return {
        KMSAccessDeniedException: await de_KMSAccessDeniedException_event(event["KMSAccessDeniedException"], context)
      };
    }
    if (event["KMSNotFoundException"] != null) {
      return {
        KMSNotFoundException: await de_KMSNotFoundException_event(event["KMSNotFoundException"], context)
      };
    }
    if (event["KMSOptInRequired"] != null) {
      return {
        KMSOptInRequired: await de_KMSOptInRequired_event(event["KMSOptInRequired"], context)
      };
    }
    if (event["KMSThrottlingException"] != null) {
      return {
        KMSThrottlingException: await de_KMSThrottlingException_event(event["KMSThrottlingException"], context)
      };
    }
    if (event["InternalFailureException"] != null) {
      return {
        InternalFailureException: await de_InternalFailureException_event(event["InternalFailureException"], context)
      };
    }
    return { $unknown: output };
  });
}, "de_SubscribeToShardEventStream");
var de_InternalFailureException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_InternalFailureExceptionRes(parsedOutput, context);
}, "de_InternalFailureException_event");
var de_KMSAccessDeniedException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_KMSAccessDeniedExceptionRes(parsedOutput, context);
}, "de_KMSAccessDeniedException_event");
var de_KMSDisabledException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_KMSDisabledExceptionRes(parsedOutput, context);
}, "de_KMSDisabledException_event");
var de_KMSInvalidStateException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_KMSInvalidStateExceptionRes(parsedOutput, context);
}, "de_KMSInvalidStateException_event");
var de_KMSNotFoundException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_KMSNotFoundExceptionRes(parsedOutput, context);
}, "de_KMSNotFoundException_event");
var de_KMSOptInRequired_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_KMSOptInRequiredRes(parsedOutput, context);
}, "de_KMSOptInRequired_event");
var de_KMSThrottlingException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_KMSThrottlingExceptionRes(parsedOutput, context);
}, "de_KMSThrottlingException_event");
var de_ResourceInUseException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_ResourceInUseExceptionRes(parsedOutput, context);
}, "de_ResourceInUseException_event");
var de_ResourceNotFoundException_event = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonBody)(output.body, context)
  };
  return de_ResourceNotFoundExceptionRes(parsedOutput, context);
}, "de_ResourceNotFoundException_event");
var de_SubscribeToShardEvent_event = /* @__PURE__ */ __name(async (output, context) => {
  const contents = {};
  const data = await (0, import_core2.parseJsonBody)(output.body, context);
  Object.assign(contents, de_SubscribeToShardEvent(data, context));
  return contents;
}, "de_SubscribeToShardEvent_event");
var de_InternalFailureExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = (0, import_smithy_client._json)(body);
  const exception = new InternalFailureException({
    $metadata: deserializeMetadata(parsedOutput),
    ...deserialized
  });
  return (0, import_smithy_client.decorateServiceException)(exception, body);
}, "de_InternalFailureExceptionRes");
var se_GetShardIteratorInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    ShardId: [],
    ShardIteratorType: [],
    StartingSequenceNumber: [],
    StreamARN: [],
    StreamName: [],
    Timestamp: (_) => _.getTime() / 1e3
  });
}, "se_GetShardIteratorInput");
var se_ListShardsInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    ExclusiveStartShardId: [],
    MaxResults: [],
    NextToken: [],
    ShardFilter: (_) => se_ShardFilter(_, context),
    StreamARN: [],
    StreamCreationTimestamp: (_) => _.getTime() / 1e3,
    StreamName: []
  });
}, "se_ListShardsInput");
var se_ListStreamConsumersInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    MaxResults: [],
    NextToken: [],
    StreamARN: [],
    StreamCreationTimestamp: (_) => _.getTime() / 1e3
  });
}, "se_ListStreamConsumersInput");
var se_PutRecordInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    Data: context.base64Encoder,
    ExplicitHashKey: [],
    PartitionKey: [],
    SequenceNumberForOrdering: [],
    StreamARN: [],
    StreamName: []
  });
}, "se_PutRecordInput");
var se_PutRecordsInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    Records: (_) => se_PutRecordsRequestEntryList(_, context),
    StreamARN: [],
    StreamName: []
  });
}, "se_PutRecordsInput");
var se_PutRecordsRequestEntry = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    Data: context.base64Encoder,
    ExplicitHashKey: [],
    PartitionKey: []
  });
}, "se_PutRecordsRequestEntry");
var se_PutRecordsRequestEntryList = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e) => e != null).map((entry) => {
    return se_PutRecordsRequestEntry(entry, context);
  });
}, "se_PutRecordsRequestEntryList");
var se_ShardFilter = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    ShardId: [],
    Timestamp: (_) => _.getTime() / 1e3,
    Type: []
  });
}, "se_ShardFilter");
var se_StartingPosition = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    SequenceNumber: [],
    Timestamp: (_) => _.getTime() / 1e3,
    Type: []
  });
}, "se_StartingPosition");
var se_SubscribeToShardInput = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    ConsumerARN: [],
    ShardId: [],
    StartingPosition: (_) => se_StartingPosition(_, context)
  });
}, "se_SubscribeToShardInput");
var de_Consumer = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    ConsumerARN: import_smithy_client.expectString,
    ConsumerCreationTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    ConsumerName: import_smithy_client.expectString,
    ConsumerStatus: import_smithy_client.expectString
  });
}, "de_Consumer");
var de_ConsumerDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    ConsumerARN: import_smithy_client.expectString,
    ConsumerCreationTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    ConsumerName: import_smithy_client.expectString,
    ConsumerStatus: import_smithy_client.expectString,
    StreamARN: import_smithy_client.expectString
  });
}, "de_ConsumerDescription");
var de_ConsumerList = /* @__PURE__ */ __name((output, context) => {
  const retVal = (output || []).filter((e) => e != null).map((entry) => {
    return de_Consumer(entry, context);
  });
  return retVal;
}, "de_ConsumerList");
var de_DescribeStreamConsumerOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    ConsumerDescription: (_) => de_ConsumerDescription(_, context)
  });
}, "de_DescribeStreamConsumerOutput");
var de_DescribeStreamOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    StreamDescription: (_) => de_StreamDescription(_, context)
  });
}, "de_DescribeStreamOutput");
var de_DescribeStreamSummaryOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    StreamDescriptionSummary: (_) => de_StreamDescriptionSummary(_, context)
  });
}, "de_DescribeStreamSummaryOutput");
var de_GetRecordsOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    ChildShards: import_smithy_client._json,
    MillisBehindLatest: import_smithy_client.expectLong,
    NextShardIterator: import_smithy_client.expectString,
    Records: (_) => de_RecordList(_, context)
  });
}, "de_GetRecordsOutput");
var de_ListStreamConsumersOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    Consumers: (_) => de_ConsumerList(_, context),
    NextToken: import_smithy_client.expectString
  });
}, "de_ListStreamConsumersOutput");
var de_ListStreamsOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    HasMoreStreams: import_smithy_client.expectBoolean,
    NextToken: import_smithy_client.expectString,
    StreamNames: import_smithy_client._json,
    StreamSummaries: (_) => de_StreamSummaryList(_, context)
  });
}, "de_ListStreamsOutput");
var de__Record = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    ApproximateArrivalTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    Data: context.base64Decoder,
    EncryptionType: import_smithy_client.expectString,
    PartitionKey: import_smithy_client.expectString,
    SequenceNumber: import_smithy_client.expectString
  });
}, "de__Record");
var de_RecordList = /* @__PURE__ */ __name((output, context) => {
  const retVal = (output || []).filter((e) => e != null).map((entry) => {
    return de__Record(entry, context);
  });
  return retVal;
}, "de_RecordList");
var de_RegisterStreamConsumerOutput = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    Consumer: (_) => de_Consumer(_, context)
  });
}, "de_RegisterStreamConsumerOutput");
var de_StreamDescription = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    EncryptionType: import_smithy_client.expectString,
    EnhancedMonitoring: import_smithy_client._json,
    HasMoreShards: import_smithy_client.expectBoolean,
    KeyId: import_smithy_client.expectString,
    RetentionPeriodHours: import_smithy_client.expectInt32,
    Shards: import_smithy_client._json,
    StreamARN: import_smithy_client.expectString,
    StreamCreationTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    StreamModeDetails: import_smithy_client._json,
    StreamName: import_smithy_client.expectString,
    StreamStatus: import_smithy_client.expectString
  });
}, "de_StreamDescription");
var de_StreamDescriptionSummary = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    ConsumerCount: import_smithy_client.expectInt32,
    EncryptionType: import_smithy_client.expectString,
    EnhancedMonitoring: import_smithy_client._json,
    KeyId: import_smithy_client.expectString,
    OpenShardCount: import_smithy_client.expectInt32,
    RetentionPeriodHours: import_smithy_client.expectInt32,
    StreamARN: import_smithy_client.expectString,
    StreamCreationTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    StreamModeDetails: import_smithy_client._json,
    StreamName: import_smithy_client.expectString,
    StreamStatus: import_smithy_client.expectString
  });
}, "de_StreamDescriptionSummary");
var de_StreamSummary = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    StreamARN: import_smithy_client.expectString,
    StreamCreationTimestamp: (_) => (0, import_smithy_client.expectNonNull)((0, import_smithy_client.parseEpochTimestamp)((0, import_smithy_client.expectNumber)(_))),
    StreamModeDetails: import_smithy_client._json,
    StreamName: import_smithy_client.expectString,
    StreamStatus: import_smithy_client.expectString
  });
}, "de_StreamSummary");
var de_StreamSummaryList = /* @__PURE__ */ __name((output, context) => {
  const retVal = (output || []).filter((e) => e != null).map((entry) => {
    return de_StreamSummary(entry, context);
  });
  return retVal;
}, "de_StreamSummaryList");
var de_SubscribeToShardEvent = /* @__PURE__ */ __name((output, context) => {
  return (0, import_smithy_client.take)(output, {
    ChildShards: import_smithy_client._json,
    ContinuationSequenceNumber: import_smithy_client.expectString,
    MillisBehindLatest: import_smithy_client.expectLong,
    Records: (_) => de_RecordList(_, context)
  });
}, "de_SubscribeToShardEvent");
var deserializeMetadata = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");
var throwDefaultError = (0, import_smithy_client.withBaseException)(KinesisServiceException);
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
    "x-amz-target": `Kinesis_20131202.${operation}`
  };
}
__name(sharedHeaders, "sharedHeaders");

// src/commands/AddTagsToStreamCommand.ts
var _AddTagsToStreamCommand = class _AddTagsToStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "AddTagsToStream", {}).n("KinesisClient", "AddTagsToStreamCommand").f(void 0, void 0).ser(se_AddTagsToStreamCommand).de(de_AddTagsToStreamCommand).build() {
};
__name(_AddTagsToStreamCommand, "AddTagsToStreamCommand");
var AddTagsToStreamCommand = _AddTagsToStreamCommand;

// src/commands/CreateStreamCommand.ts



var _CreateStreamCommand = class _CreateStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "CreateStream", {}).n("KinesisClient", "CreateStreamCommand").f(void 0, void 0).ser(se_CreateStreamCommand).de(de_CreateStreamCommand).build() {
};
__name(_CreateStreamCommand, "CreateStreamCommand");
var CreateStreamCommand = _CreateStreamCommand;

// src/commands/DecreaseStreamRetentionPeriodCommand.ts



var _DecreaseStreamRetentionPeriodCommand = class _DecreaseStreamRetentionPeriodCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DecreaseStreamRetentionPeriod", {}).n("KinesisClient", "DecreaseStreamRetentionPeriodCommand").f(void 0, void 0).ser(se_DecreaseStreamRetentionPeriodCommand).de(de_DecreaseStreamRetentionPeriodCommand).build() {
};
__name(_DecreaseStreamRetentionPeriodCommand, "DecreaseStreamRetentionPeriodCommand");
var DecreaseStreamRetentionPeriodCommand = _DecreaseStreamRetentionPeriodCommand;

// src/commands/DeleteResourcePolicyCommand.ts



var _DeleteResourcePolicyCommand = class _DeleteResourcePolicyCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  ResourceARN: { type: "contextParams", name: "ResourceARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DeleteResourcePolicy", {}).n("KinesisClient", "DeleteResourcePolicyCommand").f(void 0, void 0).ser(se_DeleteResourcePolicyCommand).de(de_DeleteResourcePolicyCommand).build() {
};
__name(_DeleteResourcePolicyCommand, "DeleteResourcePolicyCommand");
var DeleteResourcePolicyCommand = _DeleteResourcePolicyCommand;

// src/commands/DeleteStreamCommand.ts



var _DeleteStreamCommand = class _DeleteStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DeleteStream", {}).n("KinesisClient", "DeleteStreamCommand").f(void 0, void 0).ser(se_DeleteStreamCommand).de(de_DeleteStreamCommand).build() {
};
__name(_DeleteStreamCommand, "DeleteStreamCommand");
var DeleteStreamCommand = _DeleteStreamCommand;

// src/commands/DeregisterStreamConsumerCommand.ts



var _DeregisterStreamConsumerCommand = class _DeregisterStreamConsumerCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  ConsumerARN: { type: "contextParams", name: "ConsumerARN" },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DeregisterStreamConsumer", {}).n("KinesisClient", "DeregisterStreamConsumerCommand").f(void 0, void 0).ser(se_DeregisterStreamConsumerCommand).de(de_DeregisterStreamConsumerCommand).build() {
};
__name(_DeregisterStreamConsumerCommand, "DeregisterStreamConsumerCommand");
var DeregisterStreamConsumerCommand = _DeregisterStreamConsumerCommand;

// src/commands/DescribeLimitsCommand.ts



var _DescribeLimitsCommand = class _DescribeLimitsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DescribeLimits", {}).n("KinesisClient", "DescribeLimitsCommand").f(void 0, void 0).ser(se_DescribeLimitsCommand).de(de_DescribeLimitsCommand).build() {
};
__name(_DescribeLimitsCommand, "DescribeLimitsCommand");
var DescribeLimitsCommand = _DescribeLimitsCommand;

// src/commands/DescribeStreamCommand.ts



var _DescribeStreamCommand = class _DescribeStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DescribeStream", {}).n("KinesisClient", "DescribeStreamCommand").f(void 0, void 0).ser(se_DescribeStreamCommand).de(de_DescribeStreamCommand).build() {
};
__name(_DescribeStreamCommand, "DescribeStreamCommand");
var DescribeStreamCommand = _DescribeStreamCommand;

// src/commands/DescribeStreamConsumerCommand.ts



var _DescribeStreamConsumerCommand = class _DescribeStreamConsumerCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  ConsumerARN: { type: "contextParams", name: "ConsumerARN" },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DescribeStreamConsumer", {}).n("KinesisClient", "DescribeStreamConsumerCommand").f(void 0, void 0).ser(se_DescribeStreamConsumerCommand).de(de_DescribeStreamConsumerCommand).build() {
};
__name(_DescribeStreamConsumerCommand, "DescribeStreamConsumerCommand");
var DescribeStreamConsumerCommand = _DescribeStreamConsumerCommand;

// src/commands/DescribeStreamSummaryCommand.ts



var _DescribeStreamSummaryCommand = class _DescribeStreamSummaryCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DescribeStreamSummary", {}).n("KinesisClient", "DescribeStreamSummaryCommand").f(void 0, void 0).ser(se_DescribeStreamSummaryCommand).de(de_DescribeStreamSummaryCommand).build() {
};
__name(_DescribeStreamSummaryCommand, "DescribeStreamSummaryCommand");
var DescribeStreamSummaryCommand = _DescribeStreamSummaryCommand;

// src/commands/DisableEnhancedMonitoringCommand.ts



var _DisableEnhancedMonitoringCommand = class _DisableEnhancedMonitoringCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "DisableEnhancedMonitoring", {}).n("KinesisClient", "DisableEnhancedMonitoringCommand").f(void 0, void 0).ser(se_DisableEnhancedMonitoringCommand).de(de_DisableEnhancedMonitoringCommand).build() {
};
__name(_DisableEnhancedMonitoringCommand, "DisableEnhancedMonitoringCommand");
var DisableEnhancedMonitoringCommand = _DisableEnhancedMonitoringCommand;

// src/commands/EnableEnhancedMonitoringCommand.ts



var _EnableEnhancedMonitoringCommand = class _EnableEnhancedMonitoringCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "EnableEnhancedMonitoring", {}).n("KinesisClient", "EnableEnhancedMonitoringCommand").f(void 0, void 0).ser(se_EnableEnhancedMonitoringCommand).de(de_EnableEnhancedMonitoringCommand).build() {
};
__name(_EnableEnhancedMonitoringCommand, "EnableEnhancedMonitoringCommand");
var EnableEnhancedMonitoringCommand = _EnableEnhancedMonitoringCommand;

// src/commands/GetRecordsCommand.ts



var _GetRecordsCommand = class _GetRecordsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `data` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "GetRecords", {}).n("KinesisClient", "GetRecordsCommand").f(void 0, void 0).ser(se_GetRecordsCommand).de(de_GetRecordsCommand).build() {
};
__name(_GetRecordsCommand, "GetRecordsCommand");
var GetRecordsCommand = _GetRecordsCommand;

// src/commands/GetResourcePolicyCommand.ts



var _GetResourcePolicyCommand = class _GetResourcePolicyCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  ResourceARN: { type: "contextParams", name: "ResourceARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "GetResourcePolicy", {}).n("KinesisClient", "GetResourcePolicyCommand").f(void 0, void 0).ser(se_GetResourcePolicyCommand).de(de_GetResourcePolicyCommand).build() {
};
__name(_GetResourcePolicyCommand, "GetResourcePolicyCommand");
var GetResourcePolicyCommand = _GetResourcePolicyCommand;

// src/commands/GetShardIteratorCommand.ts



var _GetShardIteratorCommand = class _GetShardIteratorCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `data` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "GetShardIterator", {}).n("KinesisClient", "GetShardIteratorCommand").f(void 0, void 0).ser(se_GetShardIteratorCommand).de(de_GetShardIteratorCommand).build() {
};
__name(_GetShardIteratorCommand, "GetShardIteratorCommand");
var GetShardIteratorCommand = _GetShardIteratorCommand;

// src/commands/IncreaseStreamRetentionPeriodCommand.ts



var _IncreaseStreamRetentionPeriodCommand = class _IncreaseStreamRetentionPeriodCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "IncreaseStreamRetentionPeriod", {}).n("KinesisClient", "IncreaseStreamRetentionPeriodCommand").f(void 0, void 0).ser(se_IncreaseStreamRetentionPeriodCommand).de(de_IncreaseStreamRetentionPeriodCommand).build() {
};
__name(_IncreaseStreamRetentionPeriodCommand, "IncreaseStreamRetentionPeriodCommand");
var IncreaseStreamRetentionPeriodCommand = _IncreaseStreamRetentionPeriodCommand;

// src/commands/ListShardsCommand.ts



var _ListShardsCommand = class _ListShardsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "ListShards", {}).n("KinesisClient", "ListShardsCommand").f(void 0, void 0).ser(se_ListShardsCommand).de(de_ListShardsCommand).build() {
};
__name(_ListShardsCommand, "ListShardsCommand");
var ListShardsCommand = _ListShardsCommand;

// src/commands/ListStreamConsumersCommand.ts



var _ListStreamConsumersCommand = class _ListStreamConsumersCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "ListStreamConsumers", {}).n("KinesisClient", "ListStreamConsumersCommand").f(void 0, void 0).ser(se_ListStreamConsumersCommand).de(de_ListStreamConsumersCommand).build() {
};
__name(_ListStreamConsumersCommand, "ListStreamConsumersCommand");
var ListStreamConsumersCommand = _ListStreamConsumersCommand;

// src/commands/ListStreamsCommand.ts



var _ListStreamsCommand = class _ListStreamsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "ListStreams", {}).n("KinesisClient", "ListStreamsCommand").f(void 0, void 0).ser(se_ListStreamsCommand).de(de_ListStreamsCommand).build() {
};
__name(_ListStreamsCommand, "ListStreamsCommand");
var ListStreamsCommand = _ListStreamsCommand;

// src/commands/ListTagsForStreamCommand.ts



var _ListTagsForStreamCommand = class _ListTagsForStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "ListTagsForStream", {}).n("KinesisClient", "ListTagsForStreamCommand").f(void 0, void 0).ser(se_ListTagsForStreamCommand).de(de_ListTagsForStreamCommand).build() {
};
__name(_ListTagsForStreamCommand, "ListTagsForStreamCommand");
var ListTagsForStreamCommand = _ListTagsForStreamCommand;

// src/commands/MergeShardsCommand.ts



var _MergeShardsCommand = class _MergeShardsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "MergeShards", {}).n("KinesisClient", "MergeShardsCommand").f(void 0, void 0).ser(se_MergeShardsCommand).de(de_MergeShardsCommand).build() {
};
__name(_MergeShardsCommand, "MergeShardsCommand");
var MergeShardsCommand = _MergeShardsCommand;

// src/commands/PutRecordCommand.ts



var _PutRecordCommand = class _PutRecordCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `data` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "PutRecord", {}).n("KinesisClient", "PutRecordCommand").f(void 0, void 0).ser(se_PutRecordCommand).de(de_PutRecordCommand).build() {
};
__name(_PutRecordCommand, "PutRecordCommand");
var PutRecordCommand = _PutRecordCommand;

// src/commands/PutRecordsCommand.ts



var _PutRecordsCommand = class _PutRecordsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `data` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "PutRecords", {}).n("KinesisClient", "PutRecordsCommand").f(void 0, void 0).ser(se_PutRecordsCommand).de(de_PutRecordsCommand).build() {
};
__name(_PutRecordsCommand, "PutRecordsCommand");
var PutRecordsCommand = _PutRecordsCommand;

// src/commands/PutResourcePolicyCommand.ts



var _PutResourcePolicyCommand = class _PutResourcePolicyCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  ResourceARN: { type: "contextParams", name: "ResourceARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "PutResourcePolicy", {}).n("KinesisClient", "PutResourcePolicyCommand").f(void 0, void 0).ser(se_PutResourcePolicyCommand).de(de_PutResourcePolicyCommand).build() {
};
__name(_PutResourcePolicyCommand, "PutResourcePolicyCommand");
var PutResourcePolicyCommand = _PutResourcePolicyCommand;

// src/commands/RegisterStreamConsumerCommand.ts



var _RegisterStreamConsumerCommand = class _RegisterStreamConsumerCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "RegisterStreamConsumer", {}).n("KinesisClient", "RegisterStreamConsumerCommand").f(void 0, void 0).ser(se_RegisterStreamConsumerCommand).de(de_RegisterStreamConsumerCommand).build() {
};
__name(_RegisterStreamConsumerCommand, "RegisterStreamConsumerCommand");
var RegisterStreamConsumerCommand = _RegisterStreamConsumerCommand;

// src/commands/RemoveTagsFromStreamCommand.ts



var _RemoveTagsFromStreamCommand = class _RemoveTagsFromStreamCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "RemoveTagsFromStream", {}).n("KinesisClient", "RemoveTagsFromStreamCommand").f(void 0, void 0).ser(se_RemoveTagsFromStreamCommand).de(de_RemoveTagsFromStreamCommand).build() {
};
__name(_RemoveTagsFromStreamCommand, "RemoveTagsFromStreamCommand");
var RemoveTagsFromStreamCommand = _RemoveTagsFromStreamCommand;

// src/commands/SplitShardCommand.ts



var _SplitShardCommand = class _SplitShardCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "SplitShard", {}).n("KinesisClient", "SplitShardCommand").f(void 0, void 0).ser(se_SplitShardCommand).de(de_SplitShardCommand).build() {
};
__name(_SplitShardCommand, "SplitShardCommand");
var SplitShardCommand = _SplitShardCommand;

// src/commands/StartStreamEncryptionCommand.ts



var _StartStreamEncryptionCommand = class _StartStreamEncryptionCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "StartStreamEncryption", {}).n("KinesisClient", "StartStreamEncryptionCommand").f(void 0, void 0).ser(se_StartStreamEncryptionCommand).de(de_StartStreamEncryptionCommand).build() {
};
__name(_StartStreamEncryptionCommand, "StartStreamEncryptionCommand");
var StartStreamEncryptionCommand = _StartStreamEncryptionCommand;

// src/commands/StopStreamEncryptionCommand.ts



var _StopStreamEncryptionCommand = class _StopStreamEncryptionCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "StopStreamEncryption", {}).n("KinesisClient", "StopStreamEncryptionCommand").f(void 0, void 0).ser(se_StopStreamEncryptionCommand).de(de_StopStreamEncryptionCommand).build() {
};
__name(_StopStreamEncryptionCommand, "StopStreamEncryptionCommand");
var StopStreamEncryptionCommand = _StopStreamEncryptionCommand;

// src/commands/SubscribeToShardCommand.ts



var _SubscribeToShardCommand = class _SubscribeToShardCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `data` },
  ConsumerARN: { type: "contextParams", name: "ConsumerARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "SubscribeToShard", {
  /**
   * @internal
   */
  eventStream: {
    output: true
  }
}).n("KinesisClient", "SubscribeToShardCommand").f(void 0, SubscribeToShardOutputFilterSensitiveLog).ser(se_SubscribeToShardCommand).de(de_SubscribeToShardCommand).build() {
};
__name(_SubscribeToShardCommand, "SubscribeToShardCommand");
var SubscribeToShardCommand = _SubscribeToShardCommand;

// src/commands/UpdateShardCountCommand.ts



var _UpdateShardCountCommand = class _UpdateShardCountCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "UpdateShardCount", {}).n("KinesisClient", "UpdateShardCountCommand").f(void 0, void 0).ser(se_UpdateShardCountCommand).de(de_UpdateShardCountCommand).build() {
};
__name(_UpdateShardCountCommand, "UpdateShardCountCommand");
var UpdateShardCountCommand = _UpdateShardCountCommand;

// src/commands/UpdateStreamModeCommand.ts



var _UpdateStreamModeCommand = class _UpdateStreamModeCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams,
  OperationType: { type: "staticContextParams", value: `control` },
  StreamARN: { type: "contextParams", name: "StreamARN" }
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("Kinesis_20131202", "UpdateStreamMode", {}).n("KinesisClient", "UpdateStreamModeCommand").f(void 0, void 0).ser(se_UpdateStreamModeCommand).de(de_UpdateStreamModeCommand).build() {
};
__name(_UpdateStreamModeCommand, "UpdateStreamModeCommand");
var UpdateStreamModeCommand = _UpdateStreamModeCommand;

// src/Kinesis.ts
var commands = {
  AddTagsToStreamCommand,
  CreateStreamCommand,
  DecreaseStreamRetentionPeriodCommand,
  DeleteResourcePolicyCommand,
  DeleteStreamCommand,
  DeregisterStreamConsumerCommand,
  DescribeLimitsCommand,
  DescribeStreamCommand,
  DescribeStreamConsumerCommand,
  DescribeStreamSummaryCommand,
  DisableEnhancedMonitoringCommand,
  EnableEnhancedMonitoringCommand,
  GetRecordsCommand,
  GetResourcePolicyCommand,
  GetShardIteratorCommand,
  IncreaseStreamRetentionPeriodCommand,
  ListShardsCommand,
  ListStreamConsumersCommand,
  ListStreamsCommand,
  ListTagsForStreamCommand,
  MergeShardsCommand,
  PutRecordCommand,
  PutRecordsCommand,
  PutResourcePolicyCommand,
  RegisterStreamConsumerCommand,
  RemoveTagsFromStreamCommand,
  SplitShardCommand,
  StartStreamEncryptionCommand,
  StopStreamEncryptionCommand,
  SubscribeToShardCommand,
  UpdateShardCountCommand,
  UpdateStreamModeCommand
};
var _Kinesis = class _Kinesis extends KinesisClient {
};
__name(_Kinesis, "Kinesis");
var Kinesis = _Kinesis;
(0, import_smithy_client.createAggregatedClient)(commands, Kinesis);

// src/pagination/ListStreamConsumersPaginator.ts

var paginateListStreamConsumers = (0, import_core.createPaginator)(KinesisClient, ListStreamConsumersCommand, "NextToken", "NextToken", "MaxResults");

// src/pagination/ListStreamsPaginator.ts

var paginateListStreams = (0, import_core.createPaginator)(KinesisClient, ListStreamsCommand, "NextToken", "NextToken", "Limit");

// src/waiters/waitForStreamExists.ts
var import_util_waiter = require("@smithy/util-waiter");
var checkState = /* @__PURE__ */ __name(async (client, input) => {
  let reason;
  try {
    const result = await client.send(new DescribeStreamCommand(input));
    reason = result;
    try {
      const returnComparator = /* @__PURE__ */ __name(() => {
        return result.StreamDescription.StreamStatus;
      }, "returnComparator");
      if (returnComparator() === "ACTIVE") {
        return { state: import_util_waiter.WaiterState.SUCCESS, reason };
      }
    } catch (e) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: import_util_waiter.WaiterState.RETRY, reason };
}, "checkState");
var waitForStreamExists = /* @__PURE__ */ __name(async (params, input) => {
  const serviceDefaults = { minDelay: 10, maxDelay: 120 };
  return (0, import_util_waiter.createWaiter)({ ...serviceDefaults, ...params }, input, checkState);
}, "waitForStreamExists");
var waitUntilStreamExists = /* @__PURE__ */ __name(async (params, input) => {
  const serviceDefaults = { minDelay: 10, maxDelay: 120 };
  const result = await (0, import_util_waiter.createWaiter)({ ...serviceDefaults, ...params }, input, checkState);
  return (0, import_util_waiter.checkExceptions)(result);
}, "waitUntilStreamExists");

// src/waiters/waitForStreamNotExists.ts

var checkState2 = /* @__PURE__ */ __name(async (client, input) => {
  let reason;
  try {
    const result = await client.send(new DescribeStreamCommand(input));
    reason = result;
  } catch (exception) {
    reason = exception;
    if (exception.name && exception.name == "ResourceNotFoundException") {
      return { state: import_util_waiter.WaiterState.SUCCESS, reason };
    }
  }
  return { state: import_util_waiter.WaiterState.RETRY, reason };
}, "checkState");
var waitForStreamNotExists = /* @__PURE__ */ __name(async (params, input) => {
  const serviceDefaults = { minDelay: 10, maxDelay: 120 };
  return (0, import_util_waiter.createWaiter)({ ...serviceDefaults, ...params }, input, checkState2);
}, "waitForStreamNotExists");
var waitUntilStreamNotExists = /* @__PURE__ */ __name(async (params, input) => {
  const serviceDefaults = { minDelay: 10, maxDelay: 120 };
  const result = await (0, import_util_waiter.createWaiter)({ ...serviceDefaults, ...params }, input, checkState2);
  return (0, import_util_waiter.checkExceptions)(result);
}, "waitUntilStreamNotExists");
// Annotate the CommonJS export names for ESM import in node:

0 && (module.exports = {
  KinesisServiceException,
  __Client,
  KinesisClient,
  Kinesis,
  $Command,
  AddTagsToStreamCommand,
  CreateStreamCommand,
  DecreaseStreamRetentionPeriodCommand,
  DeleteResourcePolicyCommand,
  DeleteStreamCommand,
  DeregisterStreamConsumerCommand,
  DescribeLimitsCommand,
  DescribeStreamCommand,
  DescribeStreamConsumerCommand,
  DescribeStreamSummaryCommand,
  DisableEnhancedMonitoringCommand,
  EnableEnhancedMonitoringCommand,
  GetRecordsCommand,
  GetResourcePolicyCommand,
  GetShardIteratorCommand,
  IncreaseStreamRetentionPeriodCommand,
  ListShardsCommand,
  ListStreamConsumersCommand,
  ListStreamsCommand,
  ListTagsForStreamCommand,
  MergeShardsCommand,
  PutRecordCommand,
  PutRecordsCommand,
  PutResourcePolicyCommand,
  RegisterStreamConsumerCommand,
  RemoveTagsFromStreamCommand,
  SplitShardCommand,
  StartStreamEncryptionCommand,
  StopStreamEncryptionCommand,
  SubscribeToShardCommand,
  UpdateShardCountCommand,
  UpdateStreamModeCommand,
  paginateListStreamConsumers,
  paginateListStreams,
  waitForStreamExists,
  waitUntilStreamExists,
  waitForStreamNotExists,
  waitUntilStreamNotExists,
  AccessDeniedException,
  InvalidArgumentException,
  LimitExceededException,
  ResourceInUseException,
  ResourceNotFoundException,
  ConsumerStatus,
  StreamMode,
  EncryptionType,
  MetricsName,
  StreamStatus,
  ExpiredIteratorException,
  ExpiredNextTokenException,
  KMSAccessDeniedException,
  KMSDisabledException,
  KMSInvalidStateException,
  KMSNotFoundException,
  KMSOptInRequired,
  KMSThrottlingException,
  ProvisionedThroughputExceededException,
  ShardIteratorType,
  InternalFailureException,
  ShardFilterType,
  ValidationException,
  SubscribeToShardEventStream,
  ScalingType,
  SubscribeToShardEventStreamFilterSensitiveLog,
  SubscribeToShardOutputFilterSensitiveLog
});

