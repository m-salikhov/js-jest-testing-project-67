import UrlTransform from '../src/utils/UrlTransform.js';

const { getExtension, makeName, makeURL } = UrlTransform;

const testString = 'http://a*b$ru.test=тест?Exa123mple#foo.17.com';
const expectString = 'a-b-ru-test-тест-Exa123mple-foo-17-com';

describe('The makeName function should change all characters in the string to "-" except numbers and letters.Add ending to the end of the string', () => {
  test('common case', () => {
    expect(makeName(testString)).toBe(expectString);
  });
  test('png file', () => {
    expect(makeName('http://ru.test=тест?Exa123mple#foo.17.png')).toBe('ru-test-тест-Exa123mple-foo-17-png.png');
  });
  test('jpeg file', () => {
    expect(makeName('http://ru.test=тест?Exa123mple#foo.17.jpeg')).toBe('ru-test-тест-Exa123mple-foo-17-jpeg.jpeg');
  });
  test('/ ending', () => {
    expect(makeName(testString + '/')).toBe(expectString);
  });
  test('empty string', () => {
    expect(makeName('')).toBe('');
  });
});
