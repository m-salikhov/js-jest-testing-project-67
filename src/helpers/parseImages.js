import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import debugLogger from '../utils/debugLog.js';
import { getExtension, makeURL, makeName } from '../utils/UrlTransform.js';
import { handleAxiosError } from '../utils/handleAxiosError.js';

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
      //TODO
      console.error('can/t write');
    }
  }

  imgs.each((i, el) => {
    $(el).attr('src', ImagesLinksForHTML[i]);
  });
}

export default parseImages;
