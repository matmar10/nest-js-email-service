export class TemplateParseError extends Error {
  public errors: Array<any>;

  constructor(msg: string, errors: Array<any> = []) {
    super(msg);
    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, TemplateParseError.prototype);
    this.errors = errors;
  }
}

export class RendererNotFound extends Error {
  constructor(type: string, availableTypes: Array<string> = []) {
    const msg = !availableTypes.length
      ? `No renderer found for template type "${type}" (None are registered! Did you forget to add them via calling "registerRenderer()" ?)`
      : `No renderer found for template type "${type}" (available types are: ${availableTypes.join(
          ',',
        )})`;
    super(msg);
    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, TemplateParseError.prototype);
  }
}
