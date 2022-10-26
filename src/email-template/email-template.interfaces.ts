import { HandlebarsOptions } from './handlebars';
import { MarkdownOptions } from './markdown';

export interface TemplatePossibleArgs<T> {
  type: string;
  context?: T;
  src?: string;
  filename?: string;
}

export type TemplateArgs<T> = TemplatePossibleArgs<T> &
  ({ src: string } | { filename: string });

export interface TemplateOptions {
  handlebarsOptions?: HandlebarsOptions;
  markdownOptions?: MarkdownOptions;
}
