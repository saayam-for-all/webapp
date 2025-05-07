/**
 * Retrieves the device name using the User-Agent Client Hints API if available,
 * falling back to the traditional userAgent string if not.
 *
 * @returns {Promise<string>} A promise that resolves with a string representing the device name.
 *
 * Example Output:
 * navigator.userAgentData:
 *   'macOS 14.2.1 arm macOS Not A(Brand/99.0.0.0;Google Chrome/121.0.6167.160;Chromium/121.0.6167.160'
 * navigator.userAgent:
 *   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/115.0'
 */
export declare const getDeviceName: () => Promise<string>;
