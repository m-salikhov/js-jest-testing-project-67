import makeFileName from './utils/makeFileName.js';
import parse from '../src/parse.js';
import path from 'path';
import _axios from './utils/axiosInstance.js';
import { mkdir } from 'node:fs/promises';

async function savePage(link, output = '') {
  let html;
  try {
    html = await _axios.get(link).then((res) => res.data);
  } catch (error) {
    throw error.cause;
  }

  const directoryName = makeFileName(link);
  const directoryPath = path.join(process.cwd(), output, directoryName + '_files');
  try {
    await mkdir(directoryPath);
  } catch (error) {
    throw error;
  }

  try {
    await parse(html, directoryPath, link);
  } catch (error) {
    throw error;
  }

  return { directoryPath };
}

export default savePage;
