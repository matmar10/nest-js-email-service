import { Test, TestingModule } from '@nestjs/testing';
import { MjmlService } from './mjml.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { minify } from 'html-minifier-terser';

describe('MjmlService', () => {
  let service: MjmlService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MjmlService],
    }).compile();

    service = module.get<MjmlService>(MjmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test.each([
    ['mjml.service.spec.example-1.mjml', 'mjml.service.spec.example-1.html'],
  ])('render("%s", %o)', async (templatePath: string, expectedPath: string) => {
    // this is the expected output
    const fullExpectedPath = join(__dirname, expectedPath);
    const expected = readFileSync(fullExpectedPath, 'utf8');

    // this is the template path
    const filename = join(__dirname, templatePath);
    const src = readFileSync(filename, 'utf8');

    const actual = await service.render(src);

    const actualMinified = minify(actual);
    const expectedMinified = minify(expected);
    expect(actualMinified).toEqual(expectedMinified);
  });
});
