import 'dotenv/config';
import parse from '../src/parse.js';
import path from 'path';
import _axios from './utils/axiosInstance.js';
import { mkdir } from 'node:fs/promises';

async function savePage(link, output = '') {
  if (link.at(-1) === `/`) {
    link = link.slice(0, link.length - 1);
  }

  let html;
  try {
    html = await _axios.get(link).then((res) => res.data);
  } catch (error) {
    throw error.cause;
  }

  const directoryName = link.replace(/(http|https):\/\//, '').replace(/[^\p{L}\d]/gu, '-') + '_files';
  const directoryPath = path.join(process.cwd(), output, directoryName);
  try {
    await mkdir(directoryPath);
  } catch (error) {
    throw error;
  }

  const url = new URL(link);

  try {
    await parse(html, directoryPath, url);
  } catch (error) {
    throw error;
  }

  return { directoryPath };
}

export default savePage;
