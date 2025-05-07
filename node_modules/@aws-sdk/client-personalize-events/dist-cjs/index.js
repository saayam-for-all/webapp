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
  ActionFilterSensitiveLog: () => ActionFilterSensitiveLog,
  ActionInteractionFilterSensitiveLog: () => ActionInteractionFilterSensitiveLog,
  EventFilterSensitiveLog: () => EventFilterSensitiveLog,
  InvalidInputException: () => InvalidInputException,
  ItemFilterSensitiveLog: () => ItemFilterSensitiveLog,
  PersonalizeEvents: () => PersonalizeEvents,
  PersonalizeEventsClient: () => PersonalizeEventsClient,
  PersonalizeEventsServiceException: () => PersonalizeEventsServiceException,
  PutActionInteractionsCommand: () => PutActionInteractionsCommand,
  PutActionInteractionsRequestFilterSensitiveLog: () => PutActionInteractionsRequestFilterSensitiveLog,
  PutActionsCommand: () => PutActionsCommand,
  PutActionsRequestFilterSensitiveLog: () => PutActionsRequestFilterSensitiveLog,
  PutEventsCommand: () => PutEventsCommand,
  PutEventsRequestFilterSensitiveLog: () => PutEventsRequestFilterSensitiveLog,
  PutItemsCommand: () => PutItemsCommand,
  PutItemsRequestFilterSensitiveLog: () => PutItemsRequestFilterSensitiveLog,
  PutUsersCommand: () => PutUsersCommand,
  PutUsersRequestFilterSensitiveLog: () => PutUsersRequestFilterSensitiveLog,
  ResourceInUseException: () => ResourceInUseException,
  ResourceNotFoundException: () => ResourceNotFoundException,
  UserFilterSensitiveLog: () => UserFilterSensitiveLog,
  __Client: () => import_smithy_client.Client
});
module.exports = __toCommonJS(src_exports);

// src/PersonalizeEventsClient.ts
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
    defaultSigningName: "personalize"
  };
}, "resolveClientEndpointParameters");
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// src/PersonalizeEventsClient.ts
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

// src/PersonalizeEventsClient.ts
var _PersonalizeEventsClient = class _PersonalizeEventsClient extends import_smithy_client.Client {
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
    return import_httpAuthSchemeProvider.defaultPersonalizeEventsHttpAuthSchemeParametersProvider;
  }
  getIdentityProviderConfigProvider() {
    return async (config) => new import_core.DefaultIdentityProviderConfig({
      "aws.auth#sigv4": config.credentials
    });
  }
};
__name(_PersonalizeEventsClient, "PersonalizeEventsClient");
var PersonalizeEventsClient = _PersonalizeEventsClient;

// src/PersonalizeEvents.ts


// src/commands/PutActionInteractionsCommand.ts

var import_middleware_serde = require("@smithy/middleware-serde");


// src/models/models_0.ts


// src/models/PersonalizeEventsServiceException.ts

var _PersonalizeEventsServiceException = class _PersonalizeEventsServiceException extends import_smithy_client.ServiceException {
  /**
   * @internal
   */
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _PersonalizeEventsServiceException.prototype);
  }
};
__name(_PersonalizeEventsServiceException, "PersonalizeEventsServiceException");
var PersonalizeEventsServiceException = _PersonalizeEventsServiceException;

// src/models/models_0.ts
var _InvalidInputException = class _InvalidInputException extends PersonalizeEventsServiceException {
  /**
   * @internal
   */
  constructor(opts) {
    super({
      name: "InvalidInputException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidInputException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidInputException.prototype);
  }
};
__name(_InvalidInputException, "InvalidInputException");
var InvalidInputException = _InvalidInputException;
var _ResourceInUseException = class _ResourceInUseException extends PersonalizeEventsServiceException {
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
var _ResourceNotFoundException = class _ResourceNotFoundException extends PersonalizeEventsServiceException {
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
var ActionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.properties && { properties: import_smithy_client.SENSITIVE_STRING }
}), "ActionFilterSensitiveLog");
var ActionInteractionFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.actionId && { actionId: import_smithy_client.SENSITIVE_STRING },
  ...obj.userId && { userId: import_smithy_client.SENSITIVE_STRING },
  ...obj.impression && { impression: import_smithy_client.SENSITIVE_STRING },
  ...obj.properties && { properties: import_smithy_client.SENSITIVE_STRING }
}), "ActionInteractionFilterSensitiveLog");
var PutActionInteractionsRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.actionInteractions && {
    actionInteractions: obj.actionInteractions.map((item) => ActionInteractionFilterSensitiveLog(item))
  }
}), "PutActionInteractionsRequestFilterSensitiveLog");
var PutActionsRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.actions && { actions: obj.actions.map((item) => ActionFilterSensitiveLog(item)) }
}), "PutActionsRequestFilterSensitiveLog");
var EventFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.itemId && { itemId: import_smithy_client.SENSITIVE_STRING },
  ...obj.properties && { properties: import_smithy_client.SENSITIVE_STRING },
  ...obj.impression && { impression: import_smithy_client.SENSITIVE_STRING }
}), "EventFilterSensitiveLog");
var PutEventsRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.userId && { userId: import_smithy_client.SENSITIVE_STRING },
  ...obj.eventList && { eventList: import_smithy_client.SENSITIVE_STRING }
}), "PutEventsRequestFilterSensitiveLog");
var ItemFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.properties && { properties: import_smithy_client.SENSITIVE_STRING }
}), "ItemFilterSensitiveLog");
var PutItemsRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.items && { items: obj.items.map((item) => ItemFilterSensitiveLog(item)) }
}), "PutItemsRequestFilterSensitiveLog");
var UserFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.properties && { properties: import_smithy_client.SENSITIVE_STRING }
}), "UserFilterSensitiveLog");
var PutUsersRequestFilterSensitiveLog = /* @__PURE__ */ __name((obj) => ({
  ...obj,
  ...obj.users && { users: obj.users.map((item) => UserFilterSensitiveLog(item)) }
}), "PutUsersRequestFilterSensitiveLog");

// src/protocols/Aws_restJson1.ts
var import_core2 = require("@aws-sdk/core");


var se_PutActionInteractionsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const b = (0, import_core.requestBuilder)(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b.bp("/action-interactions");
  let body;
  body = JSON.stringify(
    (0, import_smithy_client.take)(input, {
      actionInteractions: (_) => se_ActionInteractionsList(_, context),
      trackingId: []
    })
  );
  b.m("POST").h(headers).b(body);
  return b.build();
}, "se_PutActionInteractionsCommand");
var se_PutActionsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const b = (0, import_core.requestBuilder)(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b.bp("/actions");
  let body;
  body = JSON.stringify(
    (0, import_smithy_client.take)(input, {
      actions: (_) => se_ActionList(_, context),
      datasetArn: []
    })
  );
  b.m("POST").h(headers).b(body);
  return b.build();
}, "se_PutActionsCommand");
var se_PutEventsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const b = (0, import_core.requestBuilder)(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b.bp("/events");
  let body;
  body = JSON.stringify(
    (0, import_smithy_client.take)(input, {
      eventList: (_) => se_EventList(_, context),
      sessionId: [],
      trackingId: [],
      userId: []
    })
  );
  b.m("POST").h(headers).b(body);
  return b.build();
}, "se_PutEventsCommand");
var se_PutItemsCommand = /* @__PURE__ */ __name(async (input, context) => {
  const b = (0, import_core.requestBuilder)(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b.bp("/items");
  let body;
  body = JSON.stringify(
    (0, import_smithy_client.take)(input, {
      datasetArn: [],
      items: (_) => se_ItemList(_, context)
    })
  );
  b.m("POST").h(headers).b(body);
  return b.build();
}, "se_PutItemsCommand");
var se_PutUsersCommand = /* @__PURE__ */ __name(async (input, context) => {
  const b = (0, import_core.requestBuilder)(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b.bp("/users");
  let body;
  body = JSON.stringify(
    (0, import_smithy_client.take)(input, {
      datasetArn: [],
      users: (_) => se_UserList(_, context)
    })
  );
  b.m("POST").h(headers).b(body);
  return b.build();
}, "se_PutUsersCommand");
var de_PutActionInteractionsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = (0, import_smithy_client.map)({
    $metadata: deserializeMetadata(output)
  });
  await (0, import_smithy_client.collectBody)(output.body, context);
  return contents;
}, "de_PutActionInteractionsCommand");
var de_PutActionsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = (0, import_smithy_client.map)({
    $metadata: deserializeMetadata(output)
  });
  await (0, import_smithy_client.collectBody)(output.body, context);
  return contents;
}, "de_PutActionsCommand");
var de_PutEventsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = (0, import_smithy_client.map)({
    $metadata: deserializeMetadata(output)
  });
  await (0, import_smithy_client.collectBody)(output.body, context);
  return contents;
}, "de_PutEventsCommand");
var de_PutItemsCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = (0, import_smithy_client.map)({
    $metadata: deserializeMetadata(output)
  });
  await (0, import_smithy_client.collectBody)(output.body, context);
  return contents;
}, "de_PutItemsCommand");
var de_PutUsersCommand = /* @__PURE__ */ __name(async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = (0, import_smithy_client.map)({
    $metadata: deserializeMetadata(output)
  });
  await (0, import_smithy_client.collectBody)(output.body, context);
  return contents;
}, "de_PutUsersCommand");
var de_CommandError = /* @__PURE__ */ __name(async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await (0, import_core2.parseJsonErrorBody)(output.body, context)
  };
  const errorCode = (0, import_core2.loadRestJsonErrorCode)(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidInputException":
    case "com.amazonaws.personalizeevents#InvalidInputException":
      throw await de_InvalidInputExceptionRes(parsedOutput, context);
    case "ResourceInUseException":
    case "com.amazonaws.personalizeevents#ResourceInUseException":
      throw await de_ResourceInUseExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.personalizeevents#ResourceNotFoundException":
      throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody,
        errorCode
      });
  }
}, "de_CommandError");
var throwDefaultError = (0, import_smithy_client.withBaseException)(PersonalizeEventsServiceException);
var de_InvalidInputExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = (0, import_smithy_client.map)({});
  const data = parsedOutput.body;
  const doc = (0, import_smithy_client.take)(data, {
    message: import_smithy_client.expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidInputException({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return (0, import_smithy_client.decorateServiceException)(exception, parsedOutput.body);
}, "de_InvalidInputExceptionRes");
var de_ResourceInUseExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = (0, import_smithy_client.map)({});
  const data = parsedOutput.body;
  const doc = (0, import_smithy_client.take)(data, {
    message: import_smithy_client.expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceInUseException({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return (0, import_smithy_client.decorateServiceException)(exception, parsedOutput.body);
}, "de_ResourceInUseExceptionRes");
var de_ResourceNotFoundExceptionRes = /* @__PURE__ */ __name(async (parsedOutput, context) => {
  const contents = (0, import_smithy_client.map)({});
  const data = parsedOutput.body;
  const doc = (0, import_smithy_client.take)(data, {
    message: import_smithy_client.expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotFoundException({
    $metadata: deserializeMetadata(parsedOutput),
    ...contents
  });
  return (0, import_smithy_client.decorateServiceException)(exception, parsedOutput.body);
}, "de_ResourceNotFoundExceptionRes");
var se_Action = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    actionId: [],
    properties: import_smithy_client.LazyJsonString.fromObject
  });
}, "se_Action");
var se_ActionInteraction = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    actionId: [],
    eventId: [],
    eventType: [],
    impression: import_smithy_client._json,
    properties: import_smithy_client.LazyJsonString.fromObject,
    recommendationId: [],
    sessionId: [],
    timestamp: (_) => _.getTime() / 1e3,
    userId: []
  });
}, "se_ActionInteraction");
var se_ActionInteractionsList = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e) => e != null).map((entry) => {
    return se_ActionInteraction(entry, context);
  });
}, "se_ActionInteractionsList");
var se_ActionList = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e) => e != null).map((entry) => {
    return se_Action(entry, context);
  });
}, "se_ActionList");
var se_Event = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    eventId: [],
    eventType: [],
    eventValue: import_smithy_client.serializeFloat,
    impression: import_smithy_client._json,
    itemId: [],
    metricAttribution: import_smithy_client._json,
    properties: import_smithy_client.LazyJsonString.fromObject,
    recommendationId: [],
    sentAt: (_) => _.getTime() / 1e3
  });
}, "se_Event");
var se_EventList = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e) => e != null).map((entry) => {
    return se_Event(entry, context);
  });
}, "se_EventList");
var se_Item = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    itemId: [],
    properties: import_smithy_client.LazyJsonString.fromObject
  });
}, "se_Item");
var se_ItemList = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e) => e != null).map((entry) => {
    return se_Item(entry, context);
  });
}, "se_ItemList");
var se_User = /* @__PURE__ */ __name((input, context) => {
  return (0, import_smithy_client.take)(input, {
    properties: import_smithy_client.LazyJsonString.fromObject,
    userId: []
  });
}, "se_User");
var se_UserList = /* @__PURE__ */ __name((input, context) => {
  return input.filter((e) => e != null).map((entry) => {
    return se_User(entry, context);
  });
}, "se_UserList");
var deserializeMetadata = /* @__PURE__ */ __name((output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
}), "deserializeMetadata");

// src/commands/PutActionInteractionsCommand.ts
var _PutActionInteractionsCommand = class _PutActionInteractionsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("AmazonPersonalizeEvents", "PutActionInteractions", {}).n("PersonalizeEventsClient", "PutActionInteractionsCommand").f(PutActionInteractionsRequestFilterSensitiveLog, void 0).ser(se_PutActionInteractionsCommand).de(de_PutActionInteractionsCommand).build() {
};
__name(_PutActionInteractionsCommand, "PutActionInteractionsCommand");
var PutActionInteractionsCommand = _PutActionInteractionsCommand;

// src/commands/PutActionsCommand.ts



var _PutActionsCommand = class _PutActionsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("AmazonPersonalizeEvents", "PutActions", {}).n("PersonalizeEventsClient", "PutActionsCommand").f(PutActionsRequestFilterSensitiveLog, void 0).ser(se_PutActionsCommand).de(de_PutActionsCommand).build() {
};
__name(_PutActionsCommand, "PutActionsCommand");
var PutActionsCommand = _PutActionsCommand;

// src/commands/PutEventsCommand.ts



var _PutEventsCommand = class _PutEventsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("AmazonPersonalizeEvents", "PutEvents", {}).n("PersonalizeEventsClient", "PutEventsCommand").f(PutEventsRequestFilterSensitiveLog, void 0).ser(se_PutEventsCommand).de(de_PutEventsCommand).build() {
};
__name(_PutEventsCommand, "PutEventsCommand");
var PutEventsCommand = _PutEventsCommand;

// src/commands/PutItemsCommand.ts



var _PutItemsCommand = class _PutItemsCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("AmazonPersonalizeEvents", "PutItems", {}).n("PersonalizeEventsClient", "PutItemsCommand").f(PutItemsRequestFilterSensitiveLog, void 0).ser(se_PutItemsCommand).de(de_PutItemsCommand).build() {
};
__name(_PutItemsCommand, "PutItemsCommand");
var PutItemsCommand = _PutItemsCommand;

// src/commands/PutUsersCommand.ts



var _PutUsersCommand = class _PutUsersCommand extends import_smithy_client.Command.classBuilder().ep({
  ...commonParams
}).m(function(Command, cs, config, o) {
  return [
    (0, import_middleware_serde.getSerdePlugin)(config, this.serialize, this.deserialize),
    (0, import_middleware_endpoint.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())
  ];
}).s("AmazonPersonalizeEvents", "PutUsers", {}).n("PersonalizeEventsClient", "PutUsersCommand").f(PutUsersRequestFilterSensitiveLog, void 0).ser(se_PutUsersCommand).de(de_PutUsersCommand).build() {
};
__name(_PutUsersCommand, "PutUsersCommand");
var PutUsersCommand = _PutUsersCommand;

// src/PersonalizeEvents.ts
var commands = {
  PutActionInteractionsCommand,
  PutActionsCommand,
  PutEventsCommand,
  PutItemsCommand,
  PutUsersCommand
};
var _PersonalizeEvents = class _PersonalizeEvents extends PersonalizeEventsClient {
};
__name(_PersonalizeEvents, "PersonalizeEvents");
var PersonalizeEvents = _PersonalizeEvents;
(0, import_smithy_client.createAggregatedClient)(commands, PersonalizeEvents);
// Annotate the CommonJS export names for ESM import in node:

0 && (module.exports = {
  PersonalizeEventsServiceException,
  __Client,
  PersonalizeEventsClient,
  PersonalizeEvents,
  $Command,
  PutActionInteractionsCommand,
  PutActionsCommand,
  PutEventsCommand,
  PutItemsCommand,
  PutUsersCommand,
  InvalidInputException,
  ResourceInUseException,
  ResourceNotFoundException,
  ActionFilterSensitiveLog,
  ActionInteractionFilterSensitiveLog,
  PutActionInteractionsRequestFilterSensitiveLog,
  PutActionsRequestFilterSensitiveLog,
  EventFilterSensitiveLog,
  PutEventsRequestFilterSensitiveLog,
  ItemFilterSensitiveLog,
  PutItemsRequestFilterSensitiveLog,
  UserFilterSensitiveLog,
  PutUsersRequestFilterSensitiveLog
});

