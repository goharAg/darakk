const Joi = require('joi');

module.exports = {
  name: 'comment',
  create: Joi.object({
    content: Joi.string().max(255).required().messages({
      'string.max': 'Comment must be at most 255 characters long',
      'any.required': 'Content is required',
    }),
    taskId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Task id must be an integer')
      .required()
      .messages({ 'any.required': 'Task id is required' }),
  }),
  update: Joi.object({
    content: Joi.string().max(255).required().messages({
      'string.max': 'Comment name must be at most 255 characters long',
      'any.required': 'content is required',
    }),
    commentId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Comment id must be an integer')
      .required()
      .messages({ 'any.required': 'Comment id is required' }),
  }),
  delete: Joi.object({
    commentId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Comment id must be an integer')
      .required()
      .messages({ 'any.required': 'Comment id is required' }),
  }),
};
