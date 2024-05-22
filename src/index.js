import 'dotenv/config';
import chalk from 'chalk';
import parse from '../src/parse.js';
import path from 'path';
import _axios from './utils/axiosInstance.js';
import { mkdir } from 'node:fs/promises';
import { makeName } from './utils/UrlTransform.js';
import { exit } from 'node:process';
import { handleAxiosError } from './utils/handleAxiosError.js';

async function savePage(link, output = '') {
  const url = new URL(link);

  let html;
  html = await _axios
    .get(url.href)
    .then((res) => res.data)
    .catch((error) => {
      handleAxiosError(error);
      exit(1);
    });

  const directoryName = makeName(url.href) + '_files';
  const directoryPath = path.join(process.cwd(), output, directoryName);
  try {
    await mkdir(directoryPath);
  } catch (error) {
    throw error;
  }

  try {
    await parse(html, directoryPath, url);
  } catch (error) {
    throw error;
  }

  return { directoryPath };
}

export default savePage;
