import { RuntimeOptions } from 'handlebars';

export interface HandlebarsOptions {
  runtimeOptions?: RuntimeOptions;
  compileOptions?: CompileOptions;
}

export interface HandlebarsArgs<T> {
  context?: T;
  src: string;
}
