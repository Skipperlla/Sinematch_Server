class customError extends Error {
  message: string | undefined;
  statusCode: number | undefined;
  constructor(message?: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default customError;
