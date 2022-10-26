import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { MarkdownService } from './markdown/markdown.service';
import { HandlebarsService } from './handlebars/handlebars.service';
import { MjmlService } from './mjml/mjml.service';

@Module({
  providers: [EmailTemplateService, MarkdownService, HandlebarsService, MjmlService],
  exports: [EmailTemplateModule, MarkdownService],
})
export class EmailTemplateModule {}
