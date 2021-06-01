import { parseJSON } from './parse-json';

describe('parseJSON', () => {
  it('should parse valid JSON', () => {
    const json = '{ "result": true, "count": 42 }';
    expect(parseJSON(json)).toStrictEqual({ result: true, count: 42 });
  });
  it('should return fallback if JSON is invalid', () => {
    expect(parseJSON('gobbledygook', [])).toStrictEqual([]);
  });
});
