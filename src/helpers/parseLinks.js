import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import debugLogger from '../utils/debugLog.js';
import UrlTransform from '../utils/UrlTransform.js';
import { handleAxiosError } from '../utils/handleAxiosError.js';
import chalk from 'chalk';

async function parseLinks($, directoryPath, url) {
  const linksElements = $('link');

  const { getExtension, makeName, makeURL } = UrlTransform;

  const links = [];
  linksElements.each((i, el) => {
    links.push($(el).attr('href'));
  });

  const linksWithURL = links.map((v) => makeURL(v, url));

  const linksForHTML = [];

  for (let link of linksWithURL.values()) {
    if (!getExtension(link)) {
      linksForHTML.push(link);
      continue;
    }
    const data = await axios
      .get(link, { responseType: 'arraybuffer' })
      .then((res) => res.data)
      .catch((error) => {
        handleAxiosError(error);
      });

    try {
      const fileName = makeName(link);
      await writeFile(directoryPath + '/' + fileName, data);
      linksForHTML.push(fileName);
      debugLogger('file link created %o', fileName);
    } catch (error) {
      console.error("Can't write " + chalk.red(`"${link}"`));
    }
  }

  linksElements.each((i, el) => {
    $(el).attr('href', linksForHTML[i]);
  });
}

export default parseLinks;
