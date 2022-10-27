import { Test, TestingModule } from '@nestjs/testing';
import { EmailTemplateService } from './email-template.service';
import { HandlebarsService } from './handlebars';
import { MarkdownService } from './markdown/markdown.service';
import { MjmlService } from './mjml/mjml.service';
import { EmailTemplateModule } from './email-template.module';

describe('EmailTemplateService', () => {
  const assertAll = (module: TestingModule) => {
    const service = module.get<EmailTemplateService>(EmailTemplateService);
    expect(service).toBeDefined();

    const mjml = module.get<MjmlService>(MjmlService);
    expect(mjml).toBeDefined();

    const markdown = module.get<MarkdownService>(MarkdownService);
    expect(markdown).toBeDefined();

    const handlebars = module.get<HandlebarsService>(HandlebarsService);
    expect(handlebars).toBeDefined();
  };

  it('should provide default renderers (sync)', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailTemplateModule.forRoot()],
    }).compile();
    assertAll(module);
  });

  it('should provide default renderers (async)', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailTemplateModule.forRootAsync()],
    }).compile();
    assertAll(module);
  });
});
