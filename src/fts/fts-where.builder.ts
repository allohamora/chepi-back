export class FtsWhereBuilder {
  private filter = '';

  public equal<T extends unknown>(key: string, value: T) {
    this.filter += `${key} = ${value}`;

    return this;
  }

  public notEqual<T extends unknown>(key: string, value: T) {
    this.filter += `${key} != ${value}`;

    return this;
  }

  public more<T extends unknown>(key: string, value: T) {
    this.filter += `${key} > ${value}`;

    return this;
  }

  public moreOrEqual<T extends unknown>(key: string, value: T) {
    this.filter += `${key} >= ${value}`;

    return this;
  }

  public less<T extends unknown>(key: string, value: T) {
    this.filter += `${key} < ${value}`;

    return this;
  }

  public lessOrEqual<T extends unknown>(key: string, value: T) {
    this.filter += `${key} <= ${value}`;

    return this;
  }

  public not() {
    this.filter += ' NOT ';

    return this;
  }

  public and() {
    this.filter += ' AND ';

    return this;
  }

  public or() {
    this.filter += ' OR ';

    return this;
  }

  public groupStart() {
    this.filter += '(';

    return this;
  }

  public groupEnd() {
    this.filter += ')';

    return this;
  }

  public build() {
    return this.filter;
  }
}
