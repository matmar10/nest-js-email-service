import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';

import { MarkdownService } from './markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarkdownService],
    }).compile();

    service = module.get<MarkdownService>(MarkdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test.each([
    [
      'markdown.service.spec.example-1.md',
      'markdown.service.spec.example-1.html',
    ],
  ])('render(%s, %o)', (templatePath: string, expectedPath: string) => {
    const fullTemplatePath = join(__dirname, templatePath);
    const input = readFileSync(fullTemplatePath, 'utf8');
    const fullExpectedPath = join(__dirname, expectedPath);
    const expected = readFileSync(fullExpectedPath, 'utf8');
    const actual = service.render(input);
    expect(actual).toEqual(expected);
  });
});
