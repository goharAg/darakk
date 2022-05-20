const Joi = require('joi');

module.exports = {
  name: 'task',
  create: Joi.object({
    stateId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('State id must be an integer')
      .required()
      .messages({ 'any.required': 'State id is required' }),
    title: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Task title must be at least 2 characters long',
      'string.max': 'Task title must be at most 255 characters long',
      'any.required': 'Task title is required',
    }),
    description: Joi.string().required().messages({
      'any.required': 'Description is required',
    }),
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Board id must be an integer')
      .required()
      .messages({ 'any.required': 'Board id is required' }),
  }),
  get: Joi.object({
    taskId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer'),
  }),
  update: Joi.object({
    title: Joi.string().min(2).max(255).messages({
      'string.min': 'Board name must be at least 2 characters long',
      'string.max': 'Board name must be at most 255 characters long',
    }),
    description: Joi.string(),
    taskId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Task id must be an integer')
      .required()
      .messages({ 'any.required': 'Task id is required' }),
    boardId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Board id must be an integer')
      .required()
      .messages({ 'any.required': 'Board id is required' }),
  }),
  delete: Joi.object({
    taskId: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer'),
  }),
};
