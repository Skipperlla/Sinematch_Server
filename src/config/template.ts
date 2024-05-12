type ResetEmailReturnProps = {
  subject: string;
  text: string;
};

const resetEmail = (
  host: string,
  resetToken: string,
): ResetEmailReturnProps => {
  const message = {
    subject: 'Reset Password',
    text:
      `${
        'You are receiving this because you have requested to reset your password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://'
      }${host}/reset-password/${resetToken}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  return message;
};

type CreatePasswordReturnProps = {
  subject: string;
  text: string;
};
const createPassword = (password: string): CreatePasswordReturnProps => {
  const message = {
    subject: 'Create Password',
    text: `This is the password you will use when logging in. => ${password}`,
  };
  return message;
};

const otpCode = (otpCode: number): CreatePasswordReturnProps => {
  const message = {
    subject: 'OTP Code',
    text: String(otpCode),
  };
  return message;
};

export default { resetEmail, createPassword, otpCode };
