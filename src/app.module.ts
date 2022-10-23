import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailProviderModule } from './email-provider/email-provider.module';

@Module({
  imports: [EmailProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
