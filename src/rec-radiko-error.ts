export class RecRadikoError extends Error {
  constructor(private errMessage: string) {
    super(errMessage);
    this.name = new.target.name;
    Object.setPrototypeOf(this, RecRadikoError.prototype);
  }
}
