import { Test, TestingModule } from '@nestjs/testing';
import { HandlebarsService } from './handlebars.service';
import { readFileSync } from 'fs';
import { join } from 'path';

import {
  SampleTemplateContext,
  example1,
} from './handlebars.service.spec.context';

describe('HandlebarsService', () => {
  let service: HandlebarsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandlebarsService],
    }).compile();

    service = module.get<HandlebarsService>(HandlebarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test.each([
    [
      'handlebars.service.spec.example.hbs',
      example1,
      'handlebars.service.spec.example-1.html',
    ],
  ])(
    'render("%s", %o)',
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

      // using pre-read source text from templates
      const src = readFileSync(filename, 'utf8');
      const actual1 = await service.renderContext<SampleTemplateContext>(
        src,
        context,
      );
      expect(actual1).toEqual(expected);
    },
  );
});
