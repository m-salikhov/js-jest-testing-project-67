import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import debugLogger from '../utils/debugLog.js';
import { getExtension, makeURL, makeName } from '../utils/UrlTransform.js';

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
      const fileName = makeName(imageLink);
      await writeFile(directoryPath + '/' + fileName, data);
      ImagesLinksForHTML.push(fileName);
      debugLogger('image created %o', fileName);
    } catch (error) {
      console.error('Axios can`t get ' + link);
    }
  }

  imgs.each((i, el) => {
    $(el).attr('src', ImagesLinksForHTML[i]);
  });
}

export default parseImages;
