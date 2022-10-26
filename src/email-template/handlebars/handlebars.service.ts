import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { HandlebarsOptions } from './handlebars.interfaces';
import { TemplateWithContextRenderer } from '../email-template.interfaces';

@Injectable()
export class HandlebarsService implements TemplateWithContextRenderer {
  public static readonly _name = 'handlebars';

  get name(): string {
    return HandlebarsService._name;
  }

  renderContext<Context>(
    src: string,
    context: Context,
    options?: HandlebarsOptions,
  ): Promise<string> {
    // compile the template
    const { compileOptions, runtimeOptions } = options || {};
    const template = this.compile<Context>(src, compileOptions);

    // render the template with data
    const rendered = template(context, runtimeOptions);
    return Promise.resolve(rendered);
  }

  public compile<T>(
    src: string,
    options?: CompileOptions,
  ): HandlebarsTemplateDelegate<T> {
    return Handlebars.compile<T>(src, options);
  }
}
