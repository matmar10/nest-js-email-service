/** Dependencies **/
import { Injectable, Inject, Optional } from '@nestjs/common';
import { SentMessageInfo, Transporter } from 'nodemailer';
import * as smtpTransport from 'nodemailer/lib/smtp-transport';

import { MailerOptions } from './interfaces/email-provider-options.interface';
import { ISendMailOptions } from './interfaces/send-mail-options.interface';
import { MailerTransportFactory as IMailerTransportFactory } from './interfaces/email-provider-transport-factory.interface';
import { MailerTransportFactory } from './email-provider.transport.factory';
import {
  MAILER_OPTIONS,
  MAILER_TRANSPORT_FACTORY,
} from './email-provider.constants';

@Injectable()
export default class EmailProviderService {
  private transporter!: Transporter;
  private transporters = new Map<string, Transporter>();

  constructor(
    @Inject(MAILER_OPTIONS) private readonly mailerOptions: MailerOptions,
    @Optional()
    @Inject(MAILER_TRANSPORT_FACTORY)
    private readonly transportFactory: IMailerTransportFactory,
  ) {
    if (!transportFactory) {
      this.transportFactory = new MailerTransportFactory(mailerOptions);
    }
    if (
      (!mailerOptions.transport ||
        Object.keys(mailerOptions.transport).length <= 0) &&
      !mailerOptions.transports
    ) {
      throw new Error(
        'Make sure to provide a nodemailer transport configuration object, connection url or a transport plugin instance.',
      );
    }

    /** Transporters setup **/
    if (mailerOptions.transports) {
      Object.keys(mailerOptions.transports).forEach((name) => {
        this.transporters.set(
          name,
          this.transportFactory.createTransport(
            this.mailerOptions.transports![name],
          ),
        );
      });
    }

    /** Transporter setup **/
    if (mailerOptions.transport) {
      this.transporter = this.transportFactory.createTransport();
    }
  }

  public async sendMail(
    sendMailOptions: ISendMailOptions,
  ): Promise<SentMessageInfo> {
    if (sendMailOptions.transporterName) {
      if (
        this.transporters &&
        this.transporters.get(sendMailOptions.transporterName)
      ) {
        return await this.transporters
          .get(sendMailOptions.transporterName)!
          .sendMail(sendMailOptions);
      } else {
        throw new ReferenceError(
          `Transporters object doesn't have ${sendMailOptions.transporterName} key`,
        );
      }
    } else {
      if (this.transporter) {
        return await this.transporter.sendMail(sendMailOptions);
      } else {
        throw new ReferenceError(`Transporter object undefined`);
      }
    }
  }

  addTransporter(
    transporterName: string,
    config: string | smtpTransport | smtpTransport.Options,
  ): string {
    this.transporters.set(
      transporterName,
      this.transportFactory.createTransport(config),
    );
    return transporterName;
  }
}
