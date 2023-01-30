/** Interfaces **/
import { MailerOptions } from './email-provider-options.interface';

export interface MailerOptionsFactory {
  createMailerOptions(): Promise<MailerOptions> | MailerOptions;
}
