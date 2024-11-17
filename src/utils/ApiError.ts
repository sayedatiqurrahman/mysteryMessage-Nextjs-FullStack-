class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: any;

  constructor(
    statusCode: number,
    message: string = "something went wrong",
    errors: any = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = statusCode < 399;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
