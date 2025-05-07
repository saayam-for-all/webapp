'use client';
import defer from 'lodash/defer';

/**
 * Defer callbacks to wait for DOM rendering to complete.
 */
export default (function (callback) {
  defer(callback, 'deferred');
});