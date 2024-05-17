import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import { getExtension } from '../utils/makeFileName.js';
import makeFileName from '../utils/makeFileName.js';
import debugLogger from '../utils/debugLog.js';
import { makeURL } from '../utils/makeURL.js';

async function parseLinks($, directoryPath, url) {
  const linksElements = $('link');

  const links = [];
  linksElements.each((i, el) => {
    links.push($(el).attr('href'));
  });

  const linksWithURL = makeURL(links, url);

  const linksForHTML = [];

  for (let link of linksWithURL.values()) {
    if (!getExtension(link)) {
      linksForHTML.push(link);
      continue;
    }

    try {
      const data = await axios.get(link, { responseType: 'arraybuffer' }).then((res) => res.data);
      const fileName = makeFileName(link);
      await writeFile(directoryPath + '/' + fileName, data);
      linksForHTML.push(fileName);
      debugLogger('file link created %o', fileName);
    } catch (error) {
      console.error('Axios can`t get ' + link);
    }
  }

  linksElements.each((i, el) => {
    $(el).attr('href', linksForHTML[i]);
  });
}

export default parseLinks;
