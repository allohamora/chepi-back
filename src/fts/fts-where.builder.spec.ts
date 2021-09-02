import { FtsWhereBuilder } from './fts-where.builder';

let builder: FtsWhereBuilder;

beforeEach(() => {
  builder = new FtsWhereBuilder();
});

describe('queries', () => {
  test('equal and notEqual', () => {
    const id = '1';
    const name = 'name';

    const expected = `id=${id} AND name!=${name}`;
    const actual = builder.equal('id', id).and().notEqual('name', name).build();

    expect(actual).toBe(expected);
  });

  test('more and less', () => {
    const max = 10;
    const min = 0;

    const expected = `min>${min} AND max<${max}`;
    const actual = builder.more('min', min).and().less('max', max).build();

    expect(expected).toBe(actual);
  });

  test('moreOrEqual and lessOrEqual', () => {
    const max = 10;
    const min = 0;

    const expected = `min>=${min} AND max<=${max}`;
    const actual = builder.moreOrEqual('min', min).and().lessOrEqual('max', max).build();

    expect(actual).toBe(expected);
  });

  test('or group and equal', () => {
    const genres = ['horror', 'comedy'];
    const author = 'author';

    const expected = `(genre=${genres[0]} OR genre=${genres[1]}) AND author=${author}`;
    const actual = builder
      .groupStart()
      .equal('genre', genres[0])
      .or()
      .equal('genre', genres[1])
      .groupEnd()
      .and()
      .equal('author', author)
      .build();

    expect(actual).toBe(expected);
  });

  test('equal not equal', () => {
    const author = 'author';
    const genre = 'horror';

    const expected = `author=${author} NOT genre=${genre}`;
    const actual = builder.equal('author', author).not().equal('genre', genre).build();

    expect(actual).toBe(expected);
  });
});
