import { loadRestJsonErrorCode, parseJsonErrorBody as parseErrorBody } from "@aws-sdk/core";
import { requestBuilder as rb } from "@smithy/core";
import { _json, collectBody, decorateServiceException as __decorateServiceException, expectString as __expectString, LazyJsonString as __LazyJsonString, map, serializeFloat as __serializeFloat, take, withBaseException, } from "@smithy/smithy-client";
import { InvalidInputException, ResourceInUseException, ResourceNotFoundException, } from "../models/models_0";
import { PersonalizeEventsServiceException as __BaseException } from "../models/PersonalizeEventsServiceException";
export const se_PutActionInteractionsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/action-interactions");
    let body;
    body = JSON.stringify(take(input, {
        actionInteractions: (_) => se_ActionInteractionsList(_, context),
        trackingId: [],
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
export const se_PutActionsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/actions");
    let body;
    body = JSON.stringify(take(input, {
        actions: (_) => se_ActionList(_, context),
        datasetArn: [],
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
export const se_PutEventsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/events");
    let body;
    body = JSON.stringify(take(input, {
        eventList: (_) => se_EventList(_, context),
        sessionId: [],
        trackingId: [],
        userId: [],
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
export const se_PutItemsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/items");
    let body;
    body = JSON.stringify(take(input, {
        datasetArn: [],
        items: (_) => se_ItemList(_, context),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
export const se_PutUsersCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/users");
    let body;
    body = JSON.stringify(take(input, {
        datasetArn: [],
        users: (_) => se_UserList(_, context),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
export const de_PutActionInteractionsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
export const de_PutActionsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
export const de_PutEventsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
export const de_PutItemsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
export const de_PutUsersCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
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
                errorCode,
            });
    }
};
const throwDefaultError = withBaseException(__BaseException);
const de_InvalidInputExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        message: __expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidInputException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return __decorateServiceException(exception, parsedOutput.body);
};
const de_ResourceInUseExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        message: __expectString,
    });
    Object.assign(contents, doc);
    const exception = new ResourceInUseException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return __decorateServiceException(exception, parsedOutput.body);
};
const de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        message: __expectString,
    });
    Object.assign(contents, doc);
    const exception = new ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return __decorateServiceException(exception, parsedOutput.body);
};
const se_Action = (input, context) => {
    return take(input, {
        actionId: [],
        properties: __LazyJsonString.fromObject,
    });
};
const se_ActionInteraction = (input, context) => {
    return take(input, {
        actionId: [],
        eventId: [],
        eventType: [],
        impression: _json,
        properties: __LazyJsonString.fromObject,
        recommendationId: [],
        sessionId: [],
        timestamp: (_) => _.getTime() / 1000,
        userId: [],
    });
};
const se_ActionInteractionsList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return se_ActionInteraction(entry, context);
    });
};
const se_ActionList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return se_Action(entry, context);
    });
};
const se_Event = (input, context) => {
    return take(input, {
        eventId: [],
        eventType: [],
        eventValue: __serializeFloat,
        impression: _json,
        itemId: [],
        metricAttribution: _json,
        properties: __LazyJsonString.fromObject,
        recommendationId: [],
        sentAt: (_) => _.getTime() / 1000,
    });
};
const se_EventList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return se_Event(entry, context);
    });
};
const se_Item = (input, context) => {
    return take(input, {
        itemId: [],
        properties: __LazyJsonString.fromObject,
    });
};
const se_ItemList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return se_Item(entry, context);
    });
};
const se_User = (input, context) => {
    return take(input, {
        properties: __LazyJsonString.fromObject,
        userId: [],
    });
};
const se_UserList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        return se_User(entry, context);
    });
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const isSerializableHeaderValue = (value) => value !== undefined &&
    value !== null &&
    value !== "" &&
    (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) &&
    (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
