import { Injectable } from '@nestjs/common';
import { HandlebarsService } from './handlebars';
import { MarkdownService } from './markdown/markdown.service';
import { readFileToStringAsync } from './util';
import { TemplateArgs, TemplateOptions } from './email-template.interfaces';
import { MarkdownOptions } from './markdown/markdown.interfaces';

@Injectable()
export class EmailTemplateService {
  constructor(
    private handlebars: HandlebarsService,
    private markdown: MarkdownService,
  ) {}

  async render<T>(
    args: TemplateArgs<T>,
    options?: TemplateOptions,
  ): Promise<string> {
    const { context, filename, type } = args;

    // determine template method (path vs pre-loaded src)
    const src = filename ? await readFileToStringAsync(filename) : args.src;

    const srcWithData = await this.handlebars.compileAndRender(
      {
        context,
        src,
      },
      (options || {}).handlebarsOptions,
    );

    if ('markdown' === type) {
      return this.markdown.render(srcWithData, (options || {}).markdownOptions);
    }

    throw new Error(`Unsupported template type: "${type}"`);
  }
}
