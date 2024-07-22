/**
 * Represents an API response.
 */
class ApiResponse {
  /**
   * Creates a new ApiResponse instance.
   * @param {number} statusCode - The status code of the response.
   * @param {any} data - The data returned by the API.
   * @param {string} [message="Success"] - The message associated with the response.
   */

  constructor(statusCode, data, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
