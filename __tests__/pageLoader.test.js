import pageLoader from '../src/index.js';
import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'path';
import nock from 'nock';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let relativePathToTempDir;
let data;

function filePathFixtures(fileName) {
  return path.join(__dirname, '..', '__fixtures__', fileName);
}

beforeAll(async () => {
  const pathTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  relativePathToTempDir = path.relative(process.cwd(), pathTempDir);
  data = await fs.readFile(filePathFixtures('www-test-com.html'), 'utf-8');
  nock('http://www.test.com').get('/test').reply(200, data);
  nock('http://www.test.com').get('/test1').reply(200, data);
  nock('http://www.test.com').get('/error').replyWithError('request fail');
});

test('download and save html', async () => {
  const t = await pageLoader('http://www.test.com/test', relativePathToTempDir);
  const savedFile = await fs.readFile(t.filepath, 'utf-8');
  expect(savedFile).toBe(data);
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
