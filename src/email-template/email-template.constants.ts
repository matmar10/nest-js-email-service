import { MarkdownService } from './markdown/markdown.service';
import { HandlebarsService } from './handlebars/handlebars.service';
import { MjmlService } from './mjml/mjml.service';

export const EMAIL_TEMPLATE_RENDERERS = 'EMAIL_TEMPLATE_RENDERERS';
export const CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS =
  'CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS';
export const DEFAULT_EMAIL_TEMPLATE_RENDERERS =
  'DEFAULT_EMAIL_TEMPLATE_RENDERERS';

export const defaultRenderers = [
  HandlebarsService,
  MarkdownService,
  MjmlService,
];

export const defaultRenderersProvider = {
  provide: DEFAULT_EMAIL_TEMPLATE_RENDERERS,
  useFactory: (
    handlebars: HandlebarsService,
    markdown: MarkdownService,
    mjml: MjmlService,
  ) => [
    {
      withContext: true,
      renderer: handlebars,
    },
    {
      withContext: false,
      renderer: markdown,
    },
    {
      withContext: true,
      renderer: mjml,
    },
  ],
  inject: defaultRenderers,
};

export const optionsDefaults = {
  enableDefaultRenderers: true,
  renderers: [],
};
