import pageLoader from '../src/index.js';
import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'path';
import nock from 'nock';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let relativePathToTempDir;
let dataHTML;
let dataImage;
let dataCSS;

function configureNock() {
  nock('https://www.test.com').get('/test').reply(200, dataHTML);
  nock('http://www.test.com').get('/test1').reply(200, dataHTML);
  nock('http://www.test.com').get('/error').replyWithError('request fail');
  nock('https://www.test.com').get('/assets/professions/nodejs.png').reply(200, dataImage);
  nock('https://www.test.com').get('/assets/application.css').reply(200, dataCSS);
}

function filePathFixtures(fileName) {
  return path.join(__dirname, '..', '__fixtures__', fileName);
}

beforeAll(async () => {
  const pathTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  relativePathToTempDir = path.relative(process.cwd(), pathTempDir);

  dataHTML = await fs.readFile(filePathFixtures('lesson3-input.html'), 'utf-8');
  dataImage = await fs.readFile(filePathFixtures('ru-hexlet-io-assets-professions-nodejs.png'));
  dataCSS = await fs.readFile(filePathFixtures('lesson-3.css'));

  configureNock();
});

test('download and save html', async () => {
  const { directoryPath } = await pageLoader('https://www.test.com/test', relativePathToTempDir);

  const outputFixture = await fs.readFile(filePathFixtures('lesson3-output.html'), 'utf-8');
  const savedFileHTML = await fs.readFile(directoryPath + '/www-test-com-test.html', 'utf-8');
  const savedFileImage = await fs.readFile(directoryPath + '/www-test-com-assets-professions-nodejs.png');

  expect(savedFileHTML).toBe(outputFixture.replace(/\r/g, ''));
  expect(savedFileImage.equals(dataImage)).toBe(true);
});

test('throw error on wrong file path', async () => {
  try {
    await pageLoader('http://www.test.com/test1', '/wrong/path');
  } catch ({ code }) {
    expect(code).toBe('ENOENT');
  }
});

test('throw error on failed request', async () => {
  try {
    await pageLoader('http://www.test.com/error', relativePathToTempDir);
  } catch ({ message }) {
    expect(message).toBe('request fail');
  }
});
