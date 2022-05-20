const schemas = require('../validationSchemas');
const responseHandler = require('../helpers/responseHandler');

const validateSchema = (schema, subschema) => (req, res, next) => {
  const validate = (body, params) => {
    const res = schemas[schema][subschema].validate({ ...body, ...params });
    return res;
  };

  let result;
  switch (req.method) {
    case 'GET':
      result = validate({}, req.params);
      break;
    case 'POST':
    case 'PUT':
      result = validate(req.body, req.params);
      break;
    case 'DELETE':
      result = validate({}, req.params);
      break;
    default:
      const error = new Error('Method not allowed');
      error.name = 'MethodNotAllowedError';
      result = { error };
      break;
  }

  if (result.error) {
    return responseHandler.errorResponse(result.error, res);
  }
  next();
};
module.exports = { name: 'validation', validateSchema };
