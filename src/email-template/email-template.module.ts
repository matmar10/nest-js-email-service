import { Provider, DynamicModule, Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import {
  EmailTemplateModuleOptions,
  EmailTemplateModuleAsyncOptions,
  EmailTemplateModuleOptionsFactory,
} from './email-template.interfaces';
import {
  DEFAULT_EMAIL_TEMPLATE_RENDERERS,
  EMAIL_TEMPLATE_RENDERERS,
  EMAIL_TEMPLATE_MODULE_OPTIONS,
  defaultRenderers,
  optionsDefaults,
  defaultRenderersProvider,
} from './email-template.constants';

@Module({})
export class EmailTemplateModule {
  public static register(_options: EmailTemplateModuleOptions): DynamicModule {
    const options = {
      ...optionsDefaults,
      ..._options,
    };
    const { enableDefaultRenderers, renderers } = options;
    const providers: Provider[] = [EmailTemplateService];

    if (enableDefaultRenderers) {
      providers.push(defaultRenderersProvider);
      providers.push({
        provide: EMAIL_TEMPLATE_RENDERERS,
        useFactory: (additionalRenderers) => {
          // TODO: this could result in duplicates; probably needs validation later in register method
          return renderers.concat(additionalRenderers);
        },
        inject: [DEFAULT_EMAIL_TEMPLATE_RENDERERS],
      });
    } else {
      providers.push({
        provide: EMAIL_TEMPLATE_RENDERERS,
        useValue: renderers,
      });
    }

    return {
      module: EmailTemplateModule,
      imports: [],
      providers,
      exports: enableDefaultRenderers
        ? [...defaultRenderers, EmailTemplateService]
        : [EmailTemplateService],
    };
  }

  public static registerAsync(
    optionsAsync: EmailTemplateModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: EmailTemplateModule,
      imports: optionsAsync.imports || [],
      providers: [this.createAsyncProvider(optionsAsync), EmailTemplateService],
      exports: [EmailTemplateService],
    };
  }

  private static createAsyncProvider(
    options: EmailTemplateModuleAsyncOptions,
  ): Provider {
    // useFactory - the most flexible
    if (options.useFactory) {
      return {
        provide: EMAIL_TEMPLATE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // useExisting - need to provide options literal
    if (options.useExisting) {
      return {
        provide: EMAIL_TEMPLATE_MODULE_OPTIONS,
        useFactory: async (options: EmailTemplateModuleOptions) => options,
        inject: [options.useExisting],
      };
    }

    // useClass - need to provide factory
    return {
      provide: EMAIL_TEMPLATE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: EmailTemplateModuleOptionsFactory) =>
        await optionsFactory.buildOptions(),
      inject: [options.useClass],
    };
  }
}
