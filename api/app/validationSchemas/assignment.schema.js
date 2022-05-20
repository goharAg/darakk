const Joi = require('joi');

module.exports = {
  name: 'assignment',
  create: Joi.object({
    userId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('User id must be an integer')
      .required()
      .messages({ 'any.required': 'User id id is required' }),
    taskId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Task id must be an integer')
      .required()
      .messages({ 'any.required': 'Task id id is required' }),
  }),
  delete: Joi.object({
    assignmentId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Assignment id must be an integer')
      .required()
      .messages({ 'any.required': 'Assignment id is required' }),
  }),
};
