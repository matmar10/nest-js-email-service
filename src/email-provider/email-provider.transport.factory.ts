import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

import {
  MailerOptions,
  TransportType,
} from './interfaces/email-provider-options.interface';
import { MailerTransportFactory as IMailerTransportFactory } from './interfaces/email-provider-transport-factory.interface';
import { Inject } from '@nestjs/common';
import { MAILER_OPTIONS } from './email-provider.constants';

export class MailerTransportFactory implements IMailerTransportFactory {
  constructor(
    @Inject(MAILER_OPTIONS)
    private readonly options: MailerOptions,
  ) {}

  public createTransport(opts?: TransportType): Mail {
    return createTransport(
      opts || this.options.transport,
      this.options.defaults,
    );
  }
}
