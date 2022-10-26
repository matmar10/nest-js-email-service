import { Injectable } from '@nestjs/common';
import { marked } from 'marked';

import { MarkdownOptions } from './markdown.interfaces';
import { TemplateRenderer } from '../email-template.interfaces';

@Injectable()
export class MarkdownService implements TemplateRenderer {
  public static readonly _name = 'markdown';

  get name(): string {
    return MarkdownService._name;
  }

  render(src: string, options?: MarkdownOptions): Promise<string> {
    const html = marked(src, options);
    return Promise.resolve(html);
  }
}
