import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailProviderModule } from './email-provider/email-provider.module';
import { EmailTemplateModule } from './email-template/email-template.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    EmailProviderModule.forRoot({
      transport: {
        host: process.env.EMAIL_SERVER_HOST,
        secure: false,
        port: +process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM,
      },
    }),
    EmailTemplateModule.forRoot({
      enableDefaultRenderers: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
