class ApiResponse {
  constructor({
    statusCode = 200,
    success = true,
    message = "Success",
    data = null,
    meta = null,
    pagination = null,
  }) {
    this.success = success;
    this.message = message;
    this.data = data;

    if (meta) {
      this.meta = meta;
    }

    if (pagination) {
      this.pagination = pagination;
    }

    this.statusCode = statusCode;
  } 

  send(res) {
  return res.status(this.statusCode).json({
    success: this.success,
    message: this.message,

    // pagination FIRST
    ...(this.pagination && { pagination: this.pagination }),

    // data AFTER
    data: this.data,

    ...(this.meta && { meta: this.meta }),
  });
}
}
module.exports = ApiResponse;
