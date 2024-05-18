import * as cheerio from 'cheerio';
import { writeFile } from 'node:fs/promises';
import { makeName } from './utils/UrlTransform.js';
import path from 'path';
import prettifyHTMl from './utils/prettifyHTML.js';
import parseImages from './helpers/parseImages.js';
import parseLinks from './helpers/parseLinks.js';
import parseScripts from './helpers/parseScripts.js';

async function parse(html, directoryPath, url) {
  const $ = cheerio.load(html);

  await parseImages($, directoryPath, url);
  await parseLinks($, directoryPath, url);
  await parseScripts($, directoryPath, url);

  const fileNameHTML = makeName(url.href) + '.html';

  const filePathHTML = path.join(directoryPath, fileNameHTML);

  try {
    await writeFile(filePathHTML, $.html().trim());
    await prettifyHTMl(filePathHTML);
  } catch (error) {
    throw error;
  }
}

export default parse;
