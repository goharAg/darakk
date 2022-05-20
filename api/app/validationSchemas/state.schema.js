const Joi = require('joi');

module.exports = {
  name: 'state',
  create: Joi.object({
    state_name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'State name must be at least 2 characters long',
      'string.max': 'State name must be at most 255 characters long',
      'any.required': 'State name is required',
    }),
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Board id must be an integer')
      .required()
      .messages({ 'any.required': 'Board id is required' }),
  }),
  update: Joi.object({
    state_name: Joi.string().min(2).max(255).messages({
      'string.min': 'State name must be at least 2 characters long',
      'string.max': 'State name must be at most 255 characters long',
    }),
    stateId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('State id must be an integer')
      .required()
      .messages({ 'any.required': 'State id is required' }),
  }),
  delete: Joi.object({
    stateId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('State id must be an integer')
      .required()
      .messages({ 'any.required': 'State id is required' }),
  }),
};
