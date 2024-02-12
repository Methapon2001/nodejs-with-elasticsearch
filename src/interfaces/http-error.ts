import HttpStatus from "./http-status";

class HttpError extends Error {
  /**
   * HTTP Status Code
   */
  status: HttpStatus;
  message: string;

  constructor(status: HttpStatus, message: string) {
    super(message);

    this.name = "HttpError";
    this.status = status;
    this.message = message;
  }
}

export default HttpError;
