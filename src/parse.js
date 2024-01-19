import * as cheerio from 'cheerio';
import axios from 'axios';
import { writeFile, mkdir } from 'node:fs/promises';
import makeFileName from '../src/makeFileName.js';

async function parse(html, directoryPath) {
  const $ = cheerio.load(html);

  const imgs = $('img');

  let imgsArr = [];
  imgs.each((i, el) => {
    imgsArr.push($(el).attr('src'));
  });

  for (let link of imgsArr) {
    const imgFileName = makeFileName(link);
    const arrayBuffer = await axios.get(link, { responseType: 'arraybuffer' }).then((res) => res.data);
    await writeFile(directoryPath + '/' + imgFileName, arrayBuffer);
  }
}

export default parse;
