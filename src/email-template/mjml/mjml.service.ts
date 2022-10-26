import { Injectable } from '@nestjs/common';
import mjml2Html from 'mjml';
import { MJMLParsingOptions } from 'mjml-core';
import { TemplateParseError } from '../email-template.errors';
import { TemplateRenderer } from '../email-template.interfaces';

@Injectable()
export class MjmlService implements TemplateRenderer {
  public static readonly _name = 'mjml';

  get name(): string {
    return MjmlService._name;
  }

  render(src: string, options?: MJMLParsingOptions): Promise<string> {
    const res = mjml2Html(src, options);
    if (res.errors?.length) {
      res.errors.forEach((err) => console.error(err));
      throw new TemplateParseError(
        'Could not render mjml to html:',
        res.errors,
      );
    }
    return Promise.resolve(res.html);
  }
}
