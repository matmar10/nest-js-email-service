import { Injectable } from '@nestjs/common';
import { marked } from 'marked';

import { MarkdownOptions } from './markdown.interfaces';

@Injectable()
export class MarkdownService {
  render(src: string, options?: MarkdownOptions): string {
    return marked(src, options);
  }
}
