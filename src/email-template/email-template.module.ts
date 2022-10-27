import { Provider, DynamicModule, Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import {
  EmailTemplateModuleOptions,
  EmailTemplateModuleAsyncOptions,
  EmailTemplateModuleRenderersFactory,
  RegisterRendererArg,
} from './email-template.interfaces';
import {
  CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS,
  DEFAULT_EMAIL_TEMPLATE_RENDERERS,
  EMAIL_TEMPLATE_RENDERERS,
  defaultRenderers,
  optionsDefaults,
  defaultRenderersProvider,
} from './email-template.constants';

@Module({})
export class EmailTemplateModule {
  public static forRoot(_options?: EmailTemplateModuleOptions): DynamicModule {
    const options = {
      ...optionsDefaults,
      ...(_options || {}),
    };
    const { enableDefaultRenderers, renderers: clientProvidedRenderers } =
      options;

    const providers: Provider[] = enableDefaultRenderers
      ? // use both defaults plus client-provided renderers
        [
          // each class needs to be added to providers
          // so that they can be provided by this module
          ...defaultRenderers,
          // provide the metadata about which default renderer does what
          defaultRenderersProvider,
          // merge the defaults plus any client provided renderers
          {
            provide: EMAIL_TEMPLATE_RENDERERS,
            useFactory: (defaultRenderers: RegisterRendererArg[]) => {
              // TODO: this could result in duplicates; probably needs validation later in register method
              return []
                .concat(defaultRenderers)
                .concat(clientProvidedRenderers);
            },
            inject: [DEFAULT_EMAIL_TEMPLATE_RENDERERS],
          },
          EmailTemplateService,
        ]
      : // use only the client renderes
        [
          {
            provide: EMAIL_TEMPLATE_RENDERERS,
            useValue: clientProvidedRenderers,
          },
        ];

    return {
      global: true,
      module: EmailTemplateModule,
      imports: [],
      providers,
      // if using defaults, need to export those as well
      exports: enableDefaultRenderers
        ? [...defaultRenderers, EmailTemplateService]
        : [EmailTemplateService],
    };
  }

  public static forRootAsync(
    optionsAsync?: EmailTemplateModuleAsyncOptions,
  ): DynamicModule {
    const options = {
      enableDefaultRenderers: optionsDefaults.enableDefaultRenderers,
      ...optionsAsync,
    };
    const { enableDefaultRenderers } = options;

    const clientProvidedRenderers =
      this.createAsyncProviderForClientProvidedRenderers(options);

    const providers = enableDefaultRenderers
      ? // use defaults PLUS client provided renderers
        [
          ...defaultRenderers,
          defaultRenderersProvider,
          clientProvidedRenderers,
          {
            provide: EMAIL_TEMPLATE_RENDERERS,
            useFactory: (
              defaultRenderers: RegisterRendererArg[],
              clientProvidedRenderers: RegisterRendererArg[],
            ) => {
              return []
                .concat(defaultRenderers)
                .concat(clientProvidedRenderers);
            },
            inject: [
              DEFAULT_EMAIL_TEMPLATE_RENDERERS,
              CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS,
            ],
          },
          EmailTemplateService,
        ]
      : // use ONLY renderers provided by client
        [
          clientProvidedRenderers,
          {
            provide: EMAIL_TEMPLATE_RENDERERS,
            useExisting: CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS,
          },
          EmailTemplateService,
        ];

    return {
      module: EmailTemplateModule,
      imports: options.imports || [],
      providers,
      // if using defaults, need to export those as well
      exports: enableDefaultRenderers
        ? [...defaultRenderers, EmailTemplateService]
        : [EmailTemplateService],
    };
  }

  private static createAsyncProviderForClientProvidedRenderers(
    options: EmailTemplateModuleAsyncOptions,
  ): Provider {
    // useFactory - the most flexible
    if (options.useFactory) {
      return {
        provide: CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // useExisting - need to provide options literal
    if (options.useExisting) {
      return {
        provide: CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS,
        useFactory: async (renderers: RegisterRendererArg[]) => renderers,
        inject: [options.useExisting],
      };
    }

    // useClass - need to provide factory
    if (options.useClass) {
      return {
        provide: CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS,
        useFactory: async (
          optionsFactory: EmailTemplateModuleRenderersFactory,
        ) => await optionsFactory.buildRenderers(),
        inject: [options.useClass],
      };
    }

    return {
      provide: CLIENT_PROVIDED_EMAIL_TEMPLATE_RENDERERS,
      useValue: [],
    };
  }
}
