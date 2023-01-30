import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import EmailProviderService from './email-provider/email-provider.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private emailProviderService: EmailProviderService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('sendEmail')
  async sendEmail(): Promise<any> {
    return await this.emailProviderService
      .sendMail({
        to: 'fahad.abdullah@example.com',
        subject: 'test email from service',
        from: 'fahad.abdullah@example.com',
        text: 'its email for testing dont take it seriously',
        html: '<b>its email for testing dont take it seriously</b>', // HTML body content
      })
      .then(() => {
        return 'email sent';
      })
      .catch(() => {
        return 'error occured';
      });
  }
}
