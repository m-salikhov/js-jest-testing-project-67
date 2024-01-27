import * as cheerio from 'cheerio';
import { writeFile } from 'node:fs/promises';
import makeFileName from './utils/makeFileName.js';
import path from 'path';
import prettifyHTMl from './utils/prettifyHTML.js';
import parseImages from './helpers/parseImages.js';
import parseLinks from './helpers/parseLinks.js';
import parseScripts from './helpers/parseScripts.js';

async function parse(html, directoryPath, link) {
  const url = new URL(link);

  const $ = cheerio.load(html);

  await parseImages($, directoryPath, url);
  await parseLinks($, directoryPath, url);
  await parseScripts($, directoryPath, url);

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
