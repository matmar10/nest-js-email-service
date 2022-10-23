export type EmailRecipient =
  | string
  | {
      name?: string;
      email: string;
    };

export interface EmailData {
  to?: EmailRecipient | EmailRecipient[];
  cc?: EmailRecipient | EmailRecipient[];
  bcc?: EmailRecipient | EmailRecipient[];

  from: EmailRecipient;
  replyTo?: EmailRecipient;

  sendAt?: number;

  subject?: string;
  text?: string;
  html?: string;

  templateId?: string;
}

export type SendEmailRequest = EmailData &
  ({ text: string } | { html: string });

export type SendEmailResponse = {
  request: SendEmailRequest;
  status: 200 | 202 | 204 | 400 | 401;
  message?: string;
  providerId?: string;
};

export interface EmailSyncProvider {
  send(req: SendEmailRequest): Promise<SendEmailResponse>;
}

export interface EmailAsyncProvider {
  status(res: SendEmailResponse): Promise<void | SendEmailResponse>;
}
