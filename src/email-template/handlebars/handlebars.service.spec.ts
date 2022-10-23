import { Test, TestingModule } from '@nestjs/testing';
import { HandlebarsService } from './handlebars.service';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('HandlebarsService', () => {
  let service: HandlebarsService;

  beforeEach(async () => {
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
      'handlebars.service.example-1.spec.hbs',
      {
        quality: 'poor',
        people: [
          {
            firstName: 'Matthew',
            lastName: 'Martin',
          },
          {
            firstName: 'Omar',
            lastName: 'Martin',
          },
        ],
      },
      'handlebars.service.example-1.spec.html',
    ],
  ])(
    'render(%s, %o)',
    (templatePath: string, data: any, expectedPath: string) => {
      const fullTemplatePath = join(__dirname, templatePath);
      const input = readFileSync(fullTemplatePath, 'utf8');
      const fullExpectedPath = join(__dirname, expectedPath);
      const expected = readFileSync(fullExpectedPath, 'utf8');
      const actual = service.compileAndRender(input, data);
      expect(actual).toEqual(expected);
    },
  );
});
