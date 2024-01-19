import * as cheerio from 'cheerio';
import axios from 'axios';
import { writeFile, mkdir } from 'node:fs/promises';
import makeFileName from '../src/makeFileName.js';
import path from 'path';

async function parse(html, directoryPath, link) {
  const url = new URL(link);

  const $ = cheerio.load(html);

  const imgs = $('img');

  const imagesLinks = [];
  imgs.each((i, el) => {
    imagesLinks.push($(el).attr('src'));
  });

  // const imagesNames = imagesLinks.map((link) => makeFileName(link && link.replace(/^\/+/, '')));
  const imagesNames = [];

  for (let [index, link] of imagesLinks.entries()) {
    if (!link) {
      continue;
    }
    if (/^\/\//.test(link)) {
      link = url.protocol + link;
    }
    if (!link.includes('http')) {
      link = url.origin + link;
    }

    imagesNames.push(makeFileName(link));

    try {
      const arrayBuffer = await axios.get(link, { responseType: 'arraybuffer' }).then((res) => res.data);
      await writeFile(directoryPath + '/' + imagesNames[index], arrayBuffer);
    } catch (error) {
      console.log('Axios cant get ' + link);
    }
  }

  console.log(imagesNames);

  imgs.each((i, el) => {
    $(el).attr('src', imagesNames[i]);
  });

  const fileNameHTML = makeFileName(link);
  const filepathHTML = path.join(directoryPath, fileNameHTML + '.html');

  try {
    await writeFile(filepathHTML, $.html().trim());
  } catch (error) {
    throw error;
  }
}

export default parse;
