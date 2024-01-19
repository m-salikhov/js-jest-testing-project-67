import makeFileName from '../src/makeFileName.js';

const testString = 'http://a*b$ru.test=тест?Exa123mple#foo.17.com';

describe('The makeFileName function should change all characters in the string to "-" except numbers and letters.Add ending to the end of the string', () => {
  test('common case', () => {
    expect(makeFileName(testString)).toBe('a-b-ru-test-тест-Exa123mple-foo-17-com');
  });
  test('png file', () => {
    expect(makeFileName('http://ru.test=тест?Exa123mple#foo.17.png')).toBe('ru-test-тест-Exa123mple-foo-17.png');
  });
  test('jpeg file', () => {
    expect(makeFileName('http://ru.test=тест?Exa123mple#foo.17.jpeg')).toBe('ru-test-тест-Exa123mple-foo-17.jpeg');
  });
  test('empty string', () => {
    expect(makeFileName('')).toBeUndefined();
  });
  test('without args', () => {
    expect(makeFileName()).toBeUndefined();
  });
});
