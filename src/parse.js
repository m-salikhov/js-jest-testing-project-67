import * as cheerio from 'cheerio';
import { writeFile } from 'node:fs/promises';
import UrlTransform from './utils/UrlTransform.js';
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

  const fileNameHTML = UrlTransform.makeName(url.href) + '.html';

  const filePathHTML = path.join(directoryPath, fileNameHTML);

  await writeFile(filePathHTML, $.html().trim());
  await prettifyHTMl(filePathHTML);
}

export default parse;
