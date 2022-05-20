const Joi = require('joi');

module.exports = {
  name: 'board',
  get: Joi.object({
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer'),
  }),
  update: Joi.object({
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer')
      .required()
      .messages({ 'any.required': 'Id is required' }),
    name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Board name must be at least 2 characters long',
      'string.max': 'Board name must be at most 255 characters long',
      'any.required': 'Board name is required',
    }),
  }),
  create: Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Board name must be at least 2 characters long',
      'string.max': 'Board name must be at most 255 characters long',
      'any.required': 'Board name is required',
    }),
  }),
  delete: Joi.object({
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer')
      .required()
      .messages({ 'any.required': 'Id is required' }),
  }),
};
