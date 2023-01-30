import { Test, TestingModule } from '@nestjs/testing';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemailerMock from 'nodemailer-mock';

import MailMessage from 'nodemailer/lib/mailer/mail-message';

import {
  MAILER_OPTIONS,
  MAILER_TRANSPORT_FACTORY,
} from './email-provider.constants';
import {
  MailerOptions,
  TransportType,
} from './interfaces/email-provider-options.interface';
import { MailerTransportFactory } from './interfaces/email-provider-transport-factory.interface';
import EmailProviderService from './email-provider.service';

/**
 * Common testing code for testing up a testing module and EmailProviderService
 */
async function getEmailProviderServiceForOptions(
  options: MailerOptions,
): Promise<EmailProviderService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        name: MAILER_OPTIONS,
        provide: MAILER_OPTIONS,
        useValue: options,
      },
      EmailProviderService,
    ],
  }).compile();

  const service = module.get<EmailProviderService>(EmailProviderService);
  return service;
}

/**
 * Common testing code for spying on the SMTPTransport's send() implementation
 */
function spyOnSmtpSend(onMail: (mail: MailMessage) => void) {
  return jest
    .spyOn(SMTPTransport.prototype, 'send')
    .mockImplementation(function (
      mail: MailMessage,
      callback: (
        err: Error | null,
        info: SMTPTransport.SentMessageInfo,
      ) => void,
    ): void {
      onMail(mail);
      callback(null, {
        envelope: {
          from: mail.data.from as string,
          to: [mail.data.to as string],
        },
        messageId: 'ABCD',
        accepted: [],
        rejected: [],
        pending: [],
        response: 'ok',
      });
    });
}

async function getEmailProviderServiceWithCustomTransport(
  options: MailerOptions,
): Promise<EmailProviderService> {
  class TestTransportFactory implements MailerTransportFactory {
    createTransport(options?: TransportType) {
      return nodemailerMock.createTransport({ host: 'localhost', port: -100 });
    }
  }
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        name: MAILER_OPTIONS,
        provide: MAILER_OPTIONS,
        useValue: options,
      },
      {
        name: MAILER_TRANSPORT_FACTORY,
        provide: MAILER_TRANSPORT_FACTORY,
        useClass: TestTransportFactory,
      },
      EmailProviderService,
    ],
  }).compile();
  await module.init();

  const service = module.get<EmailProviderService>(EmailProviderService);
  return service;
}

describe('EmailProviderService', () => {
  it('should not be defined if a transport is not provided', async () => {
    await expect(
      getEmailProviderServiceForOptions({}),
    ).rejects.toMatchInlineSnapshot(
      `[Error: Make sure to provide a nodemailer transport configuration object, connection url or a transport plugin instance.]`,
    );
  });

  it('should accept a smtp transport string', async () => {
    const service = await getEmailProviderServiceForOptions({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    });

    expect(service).toBeDefined();
    expect((service as any).transporter.transporter).toBeInstanceOf(
      SMTPTransport,
    );
  });

  it('should accept smtp transport options', async () => {
    const service = await getEmailProviderServiceForOptions({
      transport: {
        secure: true,
        auth: {
          user: 'user@domain.com',
          pass: 'pass',
        },
        options: {
          host: 'smtp.domain.com',
        },
      },
    });

    expect(service).toBeDefined();
    expect((service as any).transporter.transporter).toBeInstanceOf(
      SMTPTransport,
    );
  });

  it('should accept a smtp transport instance', async () => {
    const transport = new SMTPTransport({});
    const service = await getEmailProviderServiceForOptions({
      transport: transport,
    });

    expect(service).toBeDefined();
    expect((service as any).transporter.transporter).toBe(transport);
  });

  it('should send emails with nodemailer', async () => {
    let lastMail: MailMessage;
    const send = spyOnSmtpSend((mail: MailMessage) => {
      lastMail = mail;
    });

    const service = await getEmailProviderServiceForOptions({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    });

    await service.sendMail({
      from: 'user1@example.test',
      to: 'user2@example.test',
      subject: 'Test',
      html: 'This is test.',
    });

    expect(send).toHaveBeenCalled();
    expect(lastMail.data.from).toBe('user1@example.test');
    expect(lastMail.data.to).toBe('user2@example.test');
    expect(lastMail.data.subject).toBe('Test');
    expect(lastMail.data.html).toBe('This is test.');
  });

  it('should use mailerOptions.defaults when send emails', async () => {
    let lastMail: MailMessage;
    const send = spyOnSmtpSend((mail: MailMessage) => {
      lastMail = mail;
    });

    const service = await getEmailProviderServiceForOptions({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: 'user1@example.test',
      },
    });

    await service.sendMail({
      to: 'user2@example.test',
      subject: 'Test',
      html: 'This is test.',
    });

    expect(send).toHaveBeenCalled();
    expect(lastMail.data.from).toBe('user1@example.test');
  });

  it('should use custom transport to send mail', async () => {
    const service = await getEmailProviderServiceWithCustomTransport({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    });
    await service.sendMail({
      to: 'user2@example.test',
      subject: 'Test',
      html: 'This is test.',
    });

    expect(nodemailerMock.mock.getSentMail().length).toEqual(1);
  });
});
