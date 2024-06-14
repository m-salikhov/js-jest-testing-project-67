import 'dotenv/config';
import parse from '../src/parse.js';
import path from 'path';
import _axios from './utils/axiosInstance.js';
import { mkdir, rm } from 'node:fs/promises';
import { makeName } from './utils/UrlTransform.js';
import { handleAxiosError } from './utils/handleAxiosError.js';
import chalk from 'chalk';

async function savePage(link, output = '') {
  let url;
  try {
    url = new URL(link);
  } catch (error) {
    console.error(chalk.red(`"${error.message}". Сheck the spelling`));
    process.exit(1);
  }

  const html = await _axios
    .get(url.href)
    .then((res) => res.data)
    .catch((error) => {
      handleAxiosError(error);
      process.exit(1);
    });

  let directoryName = makeName(url.href) + '_files';
  let directoryPath = path.join(process.cwd(), output, directoryName);

  try {
    await mkdir(directoryPath);
  } catch (error) {
    console.error(chalk.red(error.message));
    process.exit(1);
  }

  try {
    await parse(html, directoryPath, url);
  } catch (error) {
    console.error(error.message);
    await rm(directoryPath, { recursive: true, force: true });
    process.exit(1);
  }

  return { directoryPath };
}

export default savePage;
