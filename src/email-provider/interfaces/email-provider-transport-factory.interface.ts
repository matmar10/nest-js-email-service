import * as Mail from 'nodemailer/lib/mailer';
import { TransportType } from './email-provider-options.interface';

export interface MailerTransportFactory {
  createTransport(opts?: TransportType): Mail;
}
