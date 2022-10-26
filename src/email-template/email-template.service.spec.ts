import { Test, TestingModule } from '@nestjs/testing';
import { EmailTemplateService } from './email-template.service';
import { HandlebarsService } from './handlebars';
import { MarkdownService } from './markdown/markdown.service';
import { readFileSync } from 'fs';
import { join } from 'path';

import {
  SampleTemplateContext,
  example1,
  example2,
} from './email-template.service.spec.context';
import { TemplateArgs } from './email-template.interfaces';

describe('EmailTemplateService', () => {
  let service: EmailTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailTemplateService, HandlebarsService, MarkdownService],
    }).compile();

    service = module.get<EmailTemplateService>(EmailTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test.each([
    [
      'markdown/markdown.service.spec.example-1.md',
      example1,
      'email-template.service.spec.example-1.html',
    ],
    [
      'markdown/markdown.service.spec.example-1.md',
      example2,
      'email-template.service.spec.example-2.html',
    ],
  ])(
    'render(%s, %o)',
    async (
      templatePath: string,
      context: SampleTemplateContext,
      expectedPath: string,
    ) => {
      // this is the expected output
      const fullExpectedPath = join(__dirname, expectedPath);
      const expected = readFileSync(fullExpectedPath, 'utf8');

      // this is the template path
      const filename = join(__dirname, templatePath);

      const args: TemplateArgs<SampleTemplateContext> = {
        type: 'markdown',
        context,
        filename,
      };
      const actual1 = await service.render<SampleTemplateContext>(args);
      expect(actual1).toEqual(expected);
    },
  );
});
