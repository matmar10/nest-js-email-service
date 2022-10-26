import { Injectable } from '@nestjs/common';
import mjml2Html from 'mjml';
import { MJMLParsingOptions } from 'mjml-core';
import { TemplateParseError } from '../email-template.errors';

@Injectable()
export class MjmlService {
  render(src: string, options?: MJMLParsingOptions): string {
    const res = mjml2Html(src, options);
    if (res.errors?.length) {
      res.errors.forEach((err) => console.error(err));
      throw new TemplateParseError(
        'Could not render mjml to html:',
        res.errors,
      );
    }
    return res.html;
  }
}
