import { Injectable } from '@nestjs/common';
import { marked } from 'marked';
import { HandlebarsService } from './../handlebars';
@Injectable()
export class MarkdownService {
  constructor(private handlebars: HandlebarsService) {}

  render(src: string, options?: marked.MarkedOptions): string {
    return marked(src, options);
  }
}
