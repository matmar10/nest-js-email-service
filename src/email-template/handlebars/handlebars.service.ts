import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { HandlebarsArgs, HandlebarsOptions } from './handlebars.interfaces';

@Injectable()
export class HandlebarsService {
  public compile<T>(
    src: string,
    options?: CompileOptions,
  ): HandlebarsTemplateDelegate<T> {
    return Handlebars.compile<T>(src, options);
  }

  public async compileAndRender<T>(
    args: HandlebarsArgs<T>,
    options?: HandlebarsOptions,
  ): Promise<string> {
    const { src, context } = args;

    // compile the template
    const { compileOptions, runtimeOptions } = options || {};
    const template = this.compile<T>(src, compileOptions);

    // render the template with data
    return template(context, runtimeOptions);
  }
}
