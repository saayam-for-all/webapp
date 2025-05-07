'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploadTask = exports.createDownloadTask = void 0;
const CanceledError_1 = require("../../../errors/CanceledError");
const utils_1 = require("../../../utils");
const createCancellableTask = ({ job, onCancel, }) => {
    const state = 'IN_PROGRESS';
    let canceledErrorMessage;
    const cancelableTask = {
        cancel: (message) => {
            const { state: taskState } = cancelableTask;
            if (taskState === 'CANCELED' ||
                taskState === 'ERROR' ||
                taskState === 'SUCCESS') {
                utils_1.logger.debug(`This task cannot be canceled. State: ${taskState}`);
                return;
            }
            cancelableTask.state = 'CANCELED';
            canceledErrorMessage = message;
            onCancel(canceledErrorMessage);
        },
        state,
    };
    const wrappedJobPromise = (async () => {
        try {
            const result = await job();
            cancelableTask.state = 'SUCCESS';
            return result;
        }
        catch (e) {
            if ((0, CanceledError_1.isCancelError)(e)) {
                cancelableTask.state = 'CANCELED';
                e.message = canceledErrorMessage ?? e.message;
            }
            cancelableTask.state = 'ERROR';
            throw e;
        }
    })();
    return Object.assign(cancelableTask, {
        result: wrappedJobPromise,
    });
};
exports.createDownloadTask = createCancellableTask;
const createUploadTask = ({ job, onCancel, onResume, onPause, isMultipartUpload, }) => {
    const cancellableTask = createCancellableTask({
        job,
        onCancel,
    });
    const uploadTask = Object.assign(cancellableTask, {
        pause: () => {
            const { state } = uploadTask;
            if (!isMultipartUpload || state !== 'IN_PROGRESS') {
                utils_1.logger.debug(`This task cannot be paused. State: ${state}`);
                return;
            }
            // TODO(eslint): remove this linter suppression.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            uploadTask.state = 'PAUSED';
            onPause?.();
        },
        resume: () => {
            const { state } = uploadTask;
            if (!isMultipartUpload || state !== 'PAUSED') {
                utils_1.logger.debug(`This task cannot be resumed. State: ${state}`);
                return;
            }
            // TODO(eslint): remove this linter suppression.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            uploadTask.state = 'IN_PROGRESS';
            onResume?.();
        },
    });
    return uploadTask;
};
exports.createUploadTask = createUploadTask;
//# sourceMappingURL=transferTask.js.map
