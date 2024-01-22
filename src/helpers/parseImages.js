import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import makeFileName from './makeFileName';

async function parseImages($, directoryPath, url) {
  const imgs = $('img');

  const imagesLinks = [];
  imgs.each((i, el) => {
    imagesLinks.push($(el).attr('src'));
  });

  const imagesNames = [];

  for (let [index, link] of imagesLinks.entries()) {
    if (!link) {
      imagesNames.push(makeFileName(''));
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

  imgs.each((i, el) => {
    $(el).attr('src', imagesNames[i]);
  });
}

export default parseImages;
