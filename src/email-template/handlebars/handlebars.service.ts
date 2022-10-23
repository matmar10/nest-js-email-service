import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';

@Injectable()
export class HandlebarsService {
  compile<T>(src: string): HandlebarsTemplateDelegate<T> {
    return Handlebars.compile<T>(src);
  }

  compileAndRender<T>(
    src: string,
    context: T,
    options?: RuntimeOptions,
  ): string {
    const template = this.compile<T>(src);
    return template(context, options);
  }
}
