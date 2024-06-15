import { expect, jest, test } from '@jest/globals';
import nock from 'nock';
import pageLoader from '../src/index.js';
import chalk from 'chalk';

function configureNock() {
  nock('https://ru.hexlet.io').get('/courses').reply(200, 'test');
  nock('https://ru.hexlet.io').get('/error').replyWithError('request fail');
}

beforeAll(() => {
  mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
    throw 'mockExit';
  });
  mockConsole = jest.spyOn(console, 'error').mockImplementation(() => {});

  configureNock();
});

test('несуществующий адрес', async () => {
  const errorMessage = chalk.red(`Request failed. Check if there is a typo in https://ru.hexlet.io/error`);

  try {
    await pageLoader('https://ru.hexlet.io/error');
  } catch (error) {
    expect(mockExit.mock.calls[0][0]).toBe(1);
    expect(mockConsole.mock.calls[0][0]).toBe(errorMessage);
  }
});

test('нет адреса', async () => {
  const errorMessage = chalk.red(`Invalid URL. Сheck the spelling`);

  try {
    await pageLoader();
  } catch (error) {
    expect(mockExit.mock.calls[1][0]).toBe(1);
    expect(mockConsole.mock.calls[1][0]).toBe(errorMessage);
  }
});

test('не сущестует папки для сохранения', async () => {
  try {
    await pageLoader('https://ru.hexlet.io/courses', '/wrong/path');
  } catch (error) {
    expect(mockExit.mock.calls[2][0]).toBe(1);
    expect(mockConsole.mock.calls[2][0].includes('ENOENT')).toBeTruthy();
  }
});
