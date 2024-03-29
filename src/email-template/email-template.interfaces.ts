import { ModuleMetadata, Type } from '@nestjs/common';
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

export interface NamedTemplateRenderer {
  get name(): string;
}

// does not support personalization
export interface TemplateRenderer extends NamedTemplateRenderer {
  render<Opts>(src: string, options?: Opts): Promise<string>;
}

// supports personalization
export interface TemplateWithContextRenderer extends NamedTemplateRenderer {
  renderContext<Context, Opts>(
    src: string,
    context: Context,
    options?: Opts,
  ): Promise<string>;
}

export interface RendererMeta {
  name: string;
  renderer: TemplateRenderer | TemplateWithContextRenderer;
  withContext: boolean;
}

export type RegisterRendererArg =
  | {
      renderer: TemplateRenderer;
      withContext: false;
    }
  | {
      renderer: TemplateWithContextRenderer;
      withContext: true;
    };

export interface EmailTemplateModuleOptions {
  enableDefaultRenderers: boolean;
  renderers?: RegisterRendererArg[];
}

export interface EmailTemplateModuleRenderersFactory {
  buildRenderers(): Promise<RegisterRendererArg[]>;
}

export interface EmailTemplateModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  enableDefaultRenderers: boolean;
  inject?: any[];
  useExisting?: Type<EmailTemplateModuleOptions>;
  useClass?: Type<EmailTemplateModuleRenderersFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<RegisterRendererArg[]> | RegisterRendererArg[];
}
