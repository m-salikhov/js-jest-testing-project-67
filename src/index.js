import makeFileName from '../src/makeFileName.js';
import parse from '../src/parse.js';
import path from 'path';
import axios from 'axios';
import { writeFile, mkdir } from 'node:fs/promises';

async function savePage(url, output = '') {
  let html;
  try {
    html = await axios.get(url).then((res) => res.data);
  } catch (error) {
    throw error.cause;
  }

  const directoryName = makeFileName(url);
  const directoryPath = path.join(process.cwd(), output, directoryName + '_files');
  try {
    await mkdir(directoryPath);
  } catch (error) {
    throw error;
  }

  const fileNameHTML = makeFileName(url);
  const filepathHTML = path.join(directoryPath, fileNameHTML + '.html');

  try {
    await writeFile(filepathHTML, html);
  } catch (error) {
    throw error;
  }

  try {
    await parse(html, directoryPath);
  } catch (error) {
    throw error;
  }

  return { directoryPath };
}

export default savePage;

const url = 'https://habr.com/ru/articles/787390';

savePage(url);
