import { Test, TestingModule } from '@nestjs/testing';
import { EmailProviderModule } from './email-provider.module';
import { SendGridService } from './send-grid/send-grid.service';

describe('EmailProviderModule', () => {
  let module: EmailProviderModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailProviderModule],
    }).compile();

    const sendGrid = module.get<SendGridService>(SendGridService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
