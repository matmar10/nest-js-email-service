import { Transporter } from 'nodemailer';

import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TransportType } from './email-provider-options.interface';

export interface MailerTransportFactory {
  createTransport(
    opts?: TransportType,
  ): Transporter<SMTPTransport.SentMessageInfo>;
}
