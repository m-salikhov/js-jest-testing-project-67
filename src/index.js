import makeFileName from '../src/makeFileName.js';
import path from 'path';
import axios from 'axios';
import { writeFile } from 'node:fs/promises';

async function savePage(url, output = '') {
  // const directory = output ? process.cwd() + output : process.cwd();
  const fileName = makeFileName(url);
  const filepath = path.join(process.cwd(), output, fileName);

  let html;
  try {
    html = await axios.get(url).then((res) => res.data);
  } catch (error) {
    throw error.cause;
  }

  try {
    await writeFile(filepath, html);
  } catch (error) {
    throw error;
  }

  return { filepath };
}

export default savePage;
