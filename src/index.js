import makeFileName from '../src/makeFileName.js';
import parse from '../src/parse.js';
import path from 'path';
import axios from 'axios';
import { mkdir } from 'node:fs/promises';

async function savePage(link, output = '') {
  let html;
  try {
    html = await axios.get(link).then((res) => res.data);
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

  console.log({ directoryPath });

  return { directoryPath };
}

export default savePage;
