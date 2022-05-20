const Joi = require('joi');

module.exports = {
  name: 'user',
  get: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9]+$/)
      .message('Id must be an integer'),
  }),
  signup: Joi.object({
    first_name: Joi.string()
      .min(2)
      .max(255)
      .pattern(/^[a-zA-Z]+$/)
      .required()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must be at most 255 characters long',
        'string.pattern.base': 'First name must contain only letters',
        'any.required': 'First name is required',
      }),
    last_name: Joi.string()
      .min(2)
      .max(255)
      .pattern(/^[a-zA-Z]+$/)
      .required()
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must be at most 255 characters long',
        'string.pattern.base': 'Last name must contain only letters',
        'any.required': 'Last name is required',
      }),
    email: Joi.string().email().message('Invalid email').required().messages({ 'any.required': 'Email is required' }),
    password: Joi.string()
      .min(6)
      .max(16)
      .pattern(new RegExp('[A-Z]+'), 'uppercase')
      .message('Password must contain at least one uppercase letter')
      .pattern(new RegExp('[a-z]+'), 'lowercase')
      .message('Password must contain at least one lowercase letter')
      .pattern(new RegExp('[0-9]+'), 'digit')
      .message('Password must contain at least one digit')
      .pattern(new RegExp('[!@#$%^&*.]+'), 'specialsymbol')
      .message('Password must contain at least one special symbol')
      .required()
      .messages({
        'string.empty': 'Password can not be empty!',
        'string.min': 'Password min length is 6',
        'string.max': 'Password max length is 16',
        'any.required': 'Password is required',
      }),
  }),
  login: Joi.object({
    email: Joi.string().email().message('Invalid email').required().messages({ 'any.required': 'Email is required' }),
    password: Joi.string().required().messages({
      'string.empty': 'Password can not be empty!',
      'any.required': 'Password is required',
    }),
  }),
  update: Joi.object({
    first_name: Joi.string()
      .min(2)
      .max(255)
      .pattern(/^[a-zA-Z]+$/)
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must be at most 255 characters long',
        'string.pattern.base': 'First name must contain only letters',
      }),
    last_name: Joi.string()
      .min(2)
      .max(255)
      .pattern(/^[a-zA-Z]+$/)
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must be at most 255 characters long',
        'string.pattern.base': 'Last name must contain only letters',
      }),
  }),
  changePassword: Joi.object({
    password: Joi.string(),
    new_password: Joi.string()
      .min(6)
      .max(16)
      .pattern(new RegExp('[A-Z]+'), 'uppercase')
      .message('Password must contain at least one uppercase letter')
      .pattern(new RegExp('[a-z]+'), 'lowercase')
      .message('Password must contain at least one lowercase letter')
      .pattern(new RegExp('[0-9]+'), 'digit')
      .message('Password must contain at least one digit')
      .pattern(new RegExp('[!@#$%^&*.]+'), 'specialsymbol')
      .message('Password must contain at least one special symbol')
      .messages({
        'string.empty': 'Password can not be empty!',
        'string.min': 'Password min length is 6',
        'string.max': 'Password max length is 16',
      }),
  })
    .min(1)
    .message('Invalid body: At least one field must be updated'),
};
