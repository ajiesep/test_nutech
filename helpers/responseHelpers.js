module.exports = {
  successResponse: (status, message, data = null) => {
    return {
      status,
      message,
      data,
    };
  },
  errorResponse: (status, message) => {
    return {
      status,
      message,
      data: null,
    };
  },
};
