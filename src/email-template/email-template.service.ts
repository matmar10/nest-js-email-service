import { Inject, Injectable } from '@nestjs/common';
import { readFileToStringAsync } from './util';
import { TemplateArgs } from './email-template.interfaces';
import { RendererNotFound } from './email-template.errors';
import {
  TemplateRenderer,
  TemplateWithContextRenderer,
  RendererMeta,
  RegisterRendererArg,
} from './email-template.interfaces';
import { EMAIL_TEMPLATE_RENDERERS } from './email-template.constants';

@Injectable()
export class EmailTemplateService {
  public renderers: RendererMeta[] = [];

  constructor(
    @Inject(EMAIL_TEMPLATE_RENDERERS)
    renderers: Array<RegisterRendererArg> = [],
  ) {
    renderers.forEach((meta) => this.registerRenderer(meta));
  }

  public registerRenderer(rendererMeta: RegisterRendererArg): void {
    const {
      renderer: { name },
    } = rendererMeta;
    this.renderers.push({
      ...rendererMeta,
      name,
    });
  }

  getRenderer(name: string): RendererMeta {
    const meta = this.renderers.find(
      (rendererMeta) => rendererMeta.name === name,
    );
    if (!meta) {
      throw new RendererNotFound(name);
    }
    return meta;
  }

  getDefaultContextRenderer(): TemplateWithContextRenderer {
    const meta = this.renderers.find(
      (rendererMeta) => rendererMeta.withContext,
    );
    if (!meta) {
      throw new RendererNotFound('default (with context)');
    }
    return meta.renderer as TemplateWithContextRenderer;
  }

  public async render<Context, TemplateOptions, RenderContextOptions>(
    args: TemplateArgs<Context>,
    templateOptions?: TemplateOptions,
    contextOptions?: RenderContextOptions,
  ): Promise<string> {
    const { context, filename, type } = args;

    // determine template method (path vs pre-loaded src)
    const src = filename ? await readFileToStringAsync(filename) : args.src;

    const { renderer, withContext } = this.getRenderer(type);

    // the renderer supports its own data templating engine to add context (e.g. personalization / mail-merge)
    if (withContext) {
      return (renderer as TemplateWithContextRenderer).renderContext<
        Context,
        TemplateOptions
      >(src, context, templateOptions);
    }

    // does not support data binding in the template, so first need to fill in the data
    // fallback to use the default data templating engine to add context (e.g. personalization / mail-merge)
    const defaultContextRenderer = this.getDefaultContextRenderer();
    const srcWithData = await defaultContextRenderer.renderContext<
      Context,
      RenderContextOptions
    >(src, context, contextOptions);

    // render the template out, now that data is already filled in
    return (renderer as TemplateRenderer).render<TemplateOptions>(
      srcWithData,
      templateOptions,
    );
  }
}
