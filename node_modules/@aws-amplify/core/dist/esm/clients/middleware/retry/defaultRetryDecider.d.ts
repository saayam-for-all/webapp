import { ErrorParser, HttpResponse } from '../../types';
import { RetryDeciderOutput } from './types';
/**
 * Get retry decider function
 * @param errorParser Function to load JavaScript error from HTTP response
 */
export declare const getRetryDecider: (errorParser: ErrorParser) => (response?: HttpResponse, error?: unknown) => Promise<RetryDeciderOutput>;
