import * as cheerio from 'cheerio';
import { writeFile } from 'node:fs/promises';
import makeFileName from '../src/makeFileName.js';
import path from 'path';
import prettifyHTMl from './helpers/prettifyHTML.js';
import parseImages from './helpers/parseImages.js';
import parseLinks from './helpers/parseLinks.js';

async function parse(html, directoryPath, link) {
  const url = new URL(link);

  const $ = cheerio.load(html);

  await parseImages($, directoryPath, url);
  await parseLinks($, directoryPath, url);

  const fileNameHTML = makeFileName(url.href);
  const filepathHTML = path.join(directoryPath, fileNameHTML + '.html');

  try {
    await writeFile(filepathHTML, $.html().trim());
    await prettifyHTMl(filepathHTML);
  } catch (error) {
    throw error;
  }
}

export default parse;
