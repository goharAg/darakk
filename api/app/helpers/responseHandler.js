const sendSuccess = (data, res, statusCode) => {
  const responseBody = {
    message: 'Success',
    data,
  };
  res.status(statusCode).json(responseBody);
};
const sendError = (err, res) => {
  const name = err.name;
  const messages = err.errors?.map((error) => error.message) || [err.message];
  let errorCode;
  let statusCode;

  switch (name) {
    case 'ValidationError':
    case 'SequelizeValidationError':
      statusCode = 422;
      errorCode = 'VALIDATION_ERROR';
      break;
    case 'SequelizeUniqueConstraintError':
      statusCode = 409;
      errorCode = 'UNIQUE_CONSTRAINT_ERROR';
      break;
    case 'NotFoundError':
      statusCode = 404;
      errorCode = 'NOT_FOUND_ERROR';
      break;
    case 'BadRequestError':
      statusCode = 400;
      errorCode = 'BAD_REQUEST_ERROR';
      break;
    case 'TokenExpiredError':
      statusCode = 401;
      errorCode = 'TOKEN_EXPIRED_ERROR';
      break;
    case 'UnauthorizedError':
      statusCode = 401;
      errorCode = 'UNAUTHORIZED_ERROR';
      break;
    case 'ForbiddenError':
      statusCode = 403;
      errorCode = 'ACCESS_ERROR';
      break;
    case 'LastAdminLeaveError':
      statusCode = 406;
      errorCode = 'LAST_ADMIN_LEAVE_ERROR';
      break;
    case 'MemberExistsError':
      statusCode = 409;
      errorCode = 'MEMBER_EXISTS_ERROR';
      break;
    case 'MulterError':
      statusCode = 413;
      errorCode = err.code;
      break;
    case 'UnexpectedUploadFileType':
      statusCode = 415;
      errorCode = 'UNSUPPORETED_MEDIA_TYPE';
      break;
    default:
      statusCode = 500;
      errorCode = 'INTERNAL_SERVER_ERROR';
  }

  res.status(statusCode).json({ errorCode, name, messages });
};

module.exports = {
  successResponse: (data, res, statusCode = 200) => {
    sendSuccess(data, res, statusCode);
  },
  errorResponse: (err, res) => {
    sendError(err, res);
  },
  getNotFoundError: (message) => {
    const err = new Error(message);
    err.name = 'NotFoundError';
    return err;
  },
  getBadRequestError: (message) => {
    const err = new Error(message);
    err.name = 'BadRequestError';
    return err;
  },
  getUnauthorizedError: (message) => {
    const err = new Error(message);
    err.name = 'UnauthorizedError';
    return err;
  },
  getForbiddenError: (message) => {
    const err = new Error(message);
    err.name = 'ForbiddenError';
    return err;
  },
  getLastAdminLeaveError: (message) => {
    const err = new Error(message);
    err.name = 'LastAdminLeaveError';
    return err;
  },
  getMemberExistsError: (message) => {
    const err = new Error(message);
    err.name = 'MemberExistsError';
    return err;
  },
  getUnexpectedFileType: (message) => {
    const err = new Error(message);
    err.name = 'UnexpectedUploadFileType';
    return err;
  },
};
