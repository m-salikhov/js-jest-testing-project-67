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
      // console.error('Axios can`t get ' + link);
      console.log(error);
    }
  }

  // const linksNames = [];
  // for (let [index, link] of links.entries()) {
  //   if (!link) {
  //     linksNames.push('');
  //     continue;
  //   }

  //   if (link.includes('http') && !link.includes(url.origin)) {
  //     linksNames.push(link);
  //     continue;
  //   }

  //   if (/^\/[^\/]/.test(link) && getExtension(link)) {
  //     linksNames.push(makeFileName(url.origin + link));
  //     link = url.origin + link;
  //   }
  //   if (/^\/[^\/]/.test(link) && !getExtension(link)) {
  //     linksNames.push(makeFileName(url.origin + link) + '.html');
  //     link = url.origin + link;
  //     continue;
  //   }

  //   if (/^\/\//.test(link && getExtension(link))) {
  //     linksNames.push(makeFileName(url.origin + link));
  //     link = url.protocol + link;
  //   }
  //   if (/^\/\//.test(link && !getExtension(link))) {
  //     linksNames.push(makeFileName(url.origin + link) + '.html');
  //     link = url.protocol + link;
  //     continue;
  //   }

  //   try {
  //     console.log(index, link);
  //     const data = await axios.get(link).then((res) => res.data);
  //     await writeFile(directoryPath + '/' + linksNames[index], data);
  //     debugLogger('file link created %o', linksNames[index]);
  //   } catch (error) {
  //     console.error('Axios can`t get ' + link);
  //   }
  // }

  // linksElements.each((i, el) => {
  //   $(el).attr('href', linksNames[i]);
  // });
}

export default parseLinks;
