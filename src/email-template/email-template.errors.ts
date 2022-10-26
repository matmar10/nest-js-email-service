export class TemplateParseError extends Error {
  public errors: Array<any>;

  constructor(msg: string, errors: Array<any> = []) {
    super(msg);
    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, TemplateParseError.prototype);
    this.errors = errors;
  }
}
