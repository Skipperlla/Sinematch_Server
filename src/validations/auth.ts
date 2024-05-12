import Joi from 'joi';

import { EGenders } from 'type/schema/user';

const registerValidation = Joi.object({
  fullName: Joi.string().min(3).max(30).trim().messages({
    'string.min': 'validation.user.auth.getAccessTokenValidation.min',
    'string.max': 'validation.user.auth.getAccessTokenValidation.max',
    'string.empty': 'validation.user.auth.getAccessTokenValidation.empty',
  }),
  userName: Joi.string().alphanum().min(3).max(15).trim().lowercase().messages({
    'string.min': 'validation.user.auth.register.userName.min',
    'string.max': 'validation.user.auth.register.userName.max',
    'string.alphanum': 'validation.user.auth.register.userName.regex',
    'string.empty': 'validation.user.auth.register.userName.empty',
  }),
  email: Joi.string().email().trim().lowercase().messages({
    'string.email': 'validation.user.auth.register.email.regex',
    'string.empty': 'validation.user.auth.register.email.empty',
  }),
  info: Joi.object({
    biography: Joi.string()
      .trim()
      .max(200)
      .allow('')
      .message('validation.user.auth.register.info.biographyMax'),
    birthday: Joi.date(),
    gender: Joi.number()
      .valid(
        ...Object.values(EGenders).filter((status) => {
          return typeof status === 'number';
        }),
      )
      .messages({
        'any.only': 'validation.user.auth.register.info.gender',
      }),
  }),
});

export default {
  registerValidation,
};
