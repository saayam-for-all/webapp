export interface RetryDeciderOutput {
    retryable: boolean;
    isCredentialsExpiredError?: boolean;
}
