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

  for (let [index, link] of linksWithURL.entries()) {
    if (!getExtension(link)) continue;

    try {
      const data = await axios.get(link).then((res) => res.data);
      const fileName = makeFileName(link);
      await writeFile(directoryPath + '/' + fileName, data);
      debugLogger('file link created %o', fileName);
    } catch (error) {
      console.error('Axios can`t get ' + link);
    }
  }

  // linksElements.each((i, el) => {
  //   $(el).attr('href', linksNames[i]);
  // });
}

export default parseLinks;
