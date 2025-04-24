
export class NotFoundToken extends Error {
  constructor(message: string | undefined = undefined) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundException extends Error {
  constructor(
    entity: string | undefined = undefined,
    message: string | undefined = undefined
  ) {
    super(message);
    this.name = this.constructor.name;
    this.entity = entity;
  }
  entity: string | undefined;
}

export class UnprocessableEntityException extends Error {
  constructor(
    fields: Record<never, string[]> = {},
    message: string | undefined = undefined
  ) {
    super(message);
    this.name = this.constructor.name;
    this.fields = fields;
  }

  fields: Record<never, string[]>;
}


export class UnauthorizedException extends Error {}
