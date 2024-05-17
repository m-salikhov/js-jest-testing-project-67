import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import makeFileName from '../utils/makeFileName.js';
import debugLogger from '../utils/debugLog.js';
import { makeURL } from '../utils/makeURL.js';
import { getExtension } from '../utils/makeFileName.js';

async function parseImages($, directoryPath, url) {
  const imgs = $('img');

  const imagesLinks = [];
  imgs.each((i, el) => {
    imagesLinks.push($(el).attr('src'));
  });

  const imagesLinksWithURL = makeURL(imagesLinks, url);

  const ImagesLinksForHTML = [];
  for (let imageLink of imagesLinksWithURL.values()) {
    if (!getExtension(imageLink)) {
      ImagesLinksForHTML.push(imageLink);
      continue;
    }

    try {
      const data = await axios.get(imageLink, { responseType: 'arraybuffer' }).then((res) => res.data);
      const fileName = makeFileName(imageLink);
      await writeFile(directoryPath + '/' + fileName, data);
      ImagesLinksForHTML.push(fileName);
      debugLogger('image created %o', fileName);
    } catch (error) {
      console.error('Axios can`t get ' + link);
    }
  }

  // for (let [index, link] of imagesLinks.entries()) {
  //   if (!link) {
  //     imagesNames.push(makeFileName(''));
  //     continue;
  //   }

  //   if (/^\/\//.test(link)) {
  //     link = url.protocol + link;
  //   }
  //   if (!link.includes('http')) {
  //     link = url.origin + link;
  //   }

  //   imagesNames.push(makeFileName(link));

  //   try {
  //     const arrayBuffer = await axios.get(link, { responseType: 'arraybuffer' }).then((res) => res.data);
  //     await writeFile(directoryPath + '/' + imagesNames[index], arrayBuffer);
  //     debugLogger('file img created %o', imagesNames[index]);
  //   } catch (error) {
  //     console.log('Axios cant get ' + link);
  //   }
  // }

  imgs.each((i, el) => {
    $(el).attr('src', ImagesLinksForHTML[i]);
  });
}

export default parseImages;
