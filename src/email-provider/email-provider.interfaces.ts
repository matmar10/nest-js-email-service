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
  attachments?: {
    filename: string;
    content?: any;
    path?: string;
    contentType?: string;
    cid?: string;
    encoding?: string;
    contentDisposition?: 'attachment' | 'inline' | undefined;
    href?: string;
  }[];
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
  send(req: SendEmailRequest): Promise<void>;
  status(res: SendEmailResponse): Promise<void | SendEmailResponse>;
}

export interface EmailOptions {
  service: string;
  user: string;
  password: string;
}
