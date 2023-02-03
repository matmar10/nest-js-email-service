import { Test, TestingModule } from '@nestjs/testing';
import { EmailProviderModule } from './email-provider.module';
import EmailProviderService from './email-provider.service';

describe('EmailProviderService', () => {
  const assertAll = (module: TestingModule) => {
    const service = module.get<EmailProviderService>(EmailProviderService);
    expect(service).toBeDefined();
  };

  it('should provide default email provider (sync)', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EmailProviderModule.forRoot({
          transport: 'smtp://user@domain.com:pass@smtp@domain.com',
        }),
      ],
    }).compile();
    assertAll(module);
  });

  it('should provide default email provider (async)', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EmailProviderModule.forRootAsync({
          useFactory: () => ({
            transport: 'smtps://user@domain.com:pass@smtp.domain.com',
            defaults: {
              from: '"nest-modules" <modules@nestjs.com>',
            },
          }),
        }),
      ],
    }).compile();
    assertAll(module);
  });
});
