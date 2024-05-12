import Joi from 'joi';
import { EGenders, EGendersPreferences, EMatchTypes } from 'type/schema/user';

const updateProfileValidation = Joi.object({
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
  isCompletedProfile: Joi.boolean(),
  email: Joi.string().email().trim().lowercase().messages({
    'string.email': 'validation.user.auth.register.email.regex',
    'string.empty': 'validation.user.auth.register.email.empty',
  }),
  platform: Joi.string().valid('ios', 'android'),
  appLanguage: Joi.string(),
  plan: Joi.number().valid(1, 2),
});
const updateInfoValidation = Joi.object({
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
});

const discoverySettingsValidation = Joi.object({
  genderPreference: Joi.number()
    .valid(
      ...Object.values(EGendersPreferences).filter((status) => {
        return typeof status === 'number';
      }),
    )
    .messages({
      'any.only': 'validation.user.user.discoverySettings.genderPreference',
    }),
  matchType: Joi.number()
    .valid(
      ...Object.values(EMatchTypes).filter((status) => {
        return typeof status === 'number';
      }),
    )
    .messages({
      'any.only': 'validation.user.user.discoverySettings.matchType',
    }),
  ageRange: Joi.object({
    min: Joi.date(),
    max: Joi.date(),
  }),
  locationDistance: Joi.number(),
});

export default {
  updateProfileValidation,
  discoverySettingsValidation,
  updateInfoValidation,
};
