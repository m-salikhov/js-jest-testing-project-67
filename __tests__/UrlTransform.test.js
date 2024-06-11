import UrlTransform from '../src/utils/UrlTransform.js';

const { getExtension, makeName, makeURL } = UrlTransform;

const url = new URL('https://test.com/path/');
const testString = 'http://a*b$ru.test=тест?Exa123mple#foo.17.com/';
const expectString = 'a-b-ru-test-тест-Exa123mple-foo-17-com';

describe('makeName should change all characters in the string to "-" except numbers and letters', () => {
  test('common case', () => {
    expect(makeName(testString, url)).toBe(expectString);
  });
  test('png file', () => {
    expect(makeName('http://ru.test=тест?Exa123mple#foo.17.png?a=123', url)).toBe(
      'ru-test-тест-Exa123mple-foo-17-png-a-123.png'
    );
  });
  test('jpeg file', () => {
    expect(makeName('http://ru.test=тест?Exa123mple#foo.17.jpeg', url)).toBe('ru-test-тест-Exa123mple-foo-17.jpeg');
  });
  test('random str', () => {
    expect(makeName('Rand0m_str!ng', url)).toBe('Rand0m-str-ng');
  });
  test('empty string', () => {
    expect(makeName('')).toBe('');
  });
});

describe('makeURL must add protocol and/or origin to short link and return new link', () => {
  test('without protocol', () => {
    expect(makeURL('//test.com/path', url)).toBe('https://test.com/path');
  });
  test('without origin', () => {
    expect(makeURL('/path', url)).toBe('https://test.com/path');
  });
  test('some url', () => {
    expect(makeURL(url.href)).toBe(url.href);
  });
  test('random string', () => {
    expect(makeURL('Rand0m_str!ng .', url)).toBe('Rand0m_str!ng .');
  });
  test('empty string', () => {
    expect(makeURL('', url)).toBe('');
  });
});

describe('getExtension must return extension or null', () => {
  test('with', () => {
    expect(getExtension('with.png?a=1')).toBe('.png');
  });
  test('without', () => {
    expect(getExtension('withpng?a=1')).toBeNull();
  });
  test('empty str', () => {
    expect(getExtension('')).toBeNull();
  });
});
