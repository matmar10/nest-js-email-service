import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailProviderModule } from './email-provider/email-provider.module';
import { EmailTemplateModule } from './email-template/email-template.module';

@Module({
  imports: [EmailProviderModule, EmailTemplateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
