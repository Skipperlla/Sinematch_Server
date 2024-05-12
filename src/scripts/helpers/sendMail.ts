import { Config } from '@config/index';
import sgMail, { ClientResponse } from '@sendgrid/mail';
sgMail.setApiKey(Config.sendgrid.apiKey);

export default function sendMail(
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<[ClientResponse, unknown]> {
  const mail = {
    to,
    from: {
      name: 'Sinematch Service',
      email: 'esmere1975@gmail.com',
    },
    subject,
    text,
    html,
  };

  return sgMail.send(mail);
}
