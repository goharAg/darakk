const Joi = require('joi');

module.exports = {
  name: 'member',
  update: Joi.object({
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer')
      .required()
      .messages({ 'any.required': 'Board id is required' }),
    userId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer')
      .required()
      .messages({ 'any.required': 'User id is required' }),
  }),
  leave: Joi.object({
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer')
      .required()
      .messages({ 'any.required': 'Board id is required' }),
  }),
};
