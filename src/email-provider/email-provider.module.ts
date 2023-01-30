import { DynamicModule, Module, Provider } from '@nestjs/common';
//import { ConfigModule } from '@nestjs/config';
import { MAILER_OPTIONS } from './email-provider.constants';
import EmailProviderService from './email-provider.service';
import { ValueProvider } from '@nestjs/common/interfaces';

/** Interfaces **/
import { MailerOptions } from './interfaces/email-provider-options.interface';
import { MailerAsyncOptions } from './interfaces/email-provider-async-options.interface';
import { MailerOptionsFactory } from './interfaces/email-provider-options-factory.interface';

@Module({})
export class EmailProviderModule {
  public static forRoot(options: MailerOptions): DynamicModule {
    const MailerOptionsProvider: ValueProvider<MailerOptions> = {
      provide: MAILER_OPTIONS,
      useValue: options,
    };

    return {
      module: EmailProviderModule,
      providers: [
        /** Options **/
        MailerOptionsProvider,

        /** Services **/
        EmailProviderService,
      ],
      exports: [
        /** Services **/
        EmailProviderService,
      ],
    };
  }

  public static forRootAsync(options: MailerAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options);

    return {
      module: EmailProviderModule,
      providers: [
        /** Providers **/
        ...providers,

        /** Services **/
        EmailProviderService,

        /** Extra providers **/
        ...(options.extraProviders || []),
      ],
      imports: options.imports,
      exports: [
        /** Services **/
        EmailProviderService,
      ],
    };
  }

  private static createAsyncProviders(options: MailerAsyncOptions): Provider[] {
    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(
    options: MailerAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        name: MAILER_OPTIONS,
        provide: MAILER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      name: MAILER_OPTIONS,
      provide: MAILER_OPTIONS,
      useFactory: async (optionsFactory: MailerOptionsFactory) => {
        return optionsFactory.createMailerOptions();
      },
      inject: [options.useExisting! || options.useClass!],
    };
  }
}
