import 'dotenv/config';
import pageLoader from '../src/index.js';
import os from 'node:os';
import fs from 'node:fs/promises';
import path from 'path';
import nock from 'nock';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { expect, jest, test } from '@jest/globals';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let relativePathToTempDir;
let dataHTML;
let dataImage;
let dataCSS;
let dataJS;

function configureNock() {
  nock('https://ru.hexlet.io').get('/courses').reply(200, dataHTML);
  nock('https://ru.hexlet.io').get('/test1').reply(200, dataHTML);
  nock('https://ru.hexlet.io').get('/error').replyWithError('request fail');
  nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png').reply(200, dataImage);
  nock('https://ru.hexlet.io').get('/assets/application.css').reply(200, dataCSS);
  nock('https://ru.hexlet.io').get('/packs/js/runtime.js').reply(200, dataJS);
}

function filePathFixtures(fileName) {
  return path.join(__dirname, '..', '__fixtures__', fileName);
}

beforeAll(async () => {
  const pathTempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  relativePathToTempDir = path.relative(process.cwd(), pathTempDir);

  dataHTML = await fs.readFile(filePathFixtures('lesson3-input.html'), 'utf-8');
  dataImage = await fs.readFile(filePathFixtures('ru-hexlet-io-assets-professions-nodejs.png'));
  dataCSS = await fs.readFile(filePathFixtures('lesson-3.css'), 'utf-8');
  dataJS = await fs.readFile(filePathFixtures('lesson-3.js'), 'utf-8');

  configureNock();
});

// test('download and save', async () => {
//   const { directoryPath } = await pageLoader('https://ru.hexlet.io/courses', relativePathToTempDir);
//   console.log({ directoryPath });
//   const outputFixture = await fs.readFile(filePathFixtures('lesson3-output.html'), 'utf-8');
//   const savedHTML = await fs.readFile(directoryPath + '/ru-hexlet-io-courses.html', 'utf-8');
//   const savedImage = await fs.readFile(directoryPath + '/ru-hexlet-io-assets-professions-nodejs.png');
//   const savedCSS = await fs.readFile(directoryPath + '/ru-hexlet-io-assets-application.css', 'utf-8');
//   const savedJS = await fs.readFile(directoryPath + '/ru-hexlet-io-packs-js-runtime.js', 'utf-8');

//   expect(savedHTML).toBe(outputFixture.replace(/\r/g, ''));
//   expect(savedImage.equals(dataImage)).toBe(true);
//   expect(savedCSS).toBe(dataCSS);
//   expect(savedJS).toBe(dataJS);
// }, 30000);

test('throw error on wrong file path', async () => {
  // await pageLoader('https://ru.hexlet.io/test1', '/wrong/path');
  // console.log('AFTER');
  // expect(error).toBe('mockExit');
  // expect(process.exit).toBeCalledWith(1);

  const realProcess = process;
  const exitMock = jest.fn();

  // We assign all properties of the "real process" to
  // our "mock" process, otherwise, if "myFunc" relied
  // on any of such properties (i.e `process.env.NODE_ENV`)
  // it would crash with an error like:
  // `TypeError: Cannot read property 'NODE_ENV' of undefined`.
  global.process = { ...realProcess, exit: exitMock };

  await pageLoader('https://ru.hexlet.io/test1', '/wrong/path');
  expect(exitMock).toHaveBeenCalledWith('ENOENT');
  global.process = realProcess;
}, 30000);

// test('throw error on failed request', async () => {
//   try {
//     await pageLoader('https://ru.hexlet.io/error', relativePathToTempDir);
//   } catch ({ message }) {
//     expect(message).toBe('request fail');
//   }
// });
