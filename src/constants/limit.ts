const auth = {
  REGISTER_LIMIT: 10,
  REGISTER_MS: 15 * 20 * 1000, // * 5 Minute
  LOGIN_LIMIT: 20,
  LOGIN_MS: 15 * 20 * 1000, // * 5 Minute
  FORGOT_PASSWORD_LIMIT: 5,
  FORGOT_PASSWORD_MS: 15 * 10 * 1000, // * 2.5 Minute
  SEND_OTP_CODE_LIMIT: 5,
  SEND_OTP_CODE_LIMIT_MS: 15 * 10 * 1000, // * 2.5 Minute
};

export { auth };
