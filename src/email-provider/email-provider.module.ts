import { Module } from '@nestjs/common';
import { EmailProviderService } from './email-provider.service';

@Module({
  providers: [EmailProviderService],
})
export class EmailProviderModule {}
