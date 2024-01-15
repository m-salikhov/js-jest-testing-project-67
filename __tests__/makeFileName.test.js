import makeFileName from '../src/makeFileName.js';

describe('The makeFileName function should change all characters in the url to "-" except numbers and letters and add .html to the end of the url', () => {
  test('regular url', () => {
    expect(makeFileName('ru.test=тест?Exa123mple#foo.17.com')).toBe('ru-test-тест-Exa123mple-foo-17-com.html');
  });
  test('empty string', () => {
    expect(makeFileName('')).toBe('.html');
  });
});
