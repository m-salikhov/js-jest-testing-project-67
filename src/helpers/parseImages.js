import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import debugLogger from '../utils/debugLog.js';
import UrlTransform from '../utils/UrlTransform.js';
import { handleAxiosError } from '../utils/handleAxiosError.js';
import chalk from 'chalk';

async function parseImages($, directoryPath, url) {
  const imgs = $('img');

  const { getExtension, makeName, makeURL } = UrlTransform;

  const imagesLinks = [];
  imgs.each((i, el) => {
    imagesLinks.push($(el).attr('src'));
  });

  const imagesLinksWithURL = imagesLinks.map((v) => makeURL(v, url));

  const ImagesLinksForHTML = [];
  for (let imageLink of imagesLinksWithURL.values()) {
    if (!getExtension(imageLink)) {
      ImagesLinksForHTML.push(imageLink);
      continue;
    }

    const data = await axios
      .get(imageLink, { responseType: 'arraybuffer' })
      .then((res) => res.data)
      .catch((error) => {
        handleAxiosError(error);
      });

    try {
      const fileName = makeName(imageLink);
      await writeFile(directoryPath + '/' + fileName, data);
      ImagesLinksForHTML.push(fileName);
      debugLogger('image created %o', fileName);
    } catch (error) {
      console.error("Can't write " + chalk.red(`"${imageLink}"`));
    }
  }

  imgs.each((i, el) => {
    $(el).attr('src', ImagesLinksForHTML[i]);
  });
}

export default parseImages;
