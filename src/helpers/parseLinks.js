import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import { checkExtension } from '../utils/makeFileName.js';
import makeFileName from '../utils/makeFileName.js';

async function parseLinks($, directoryPath, url) {
  const linksElements = $('link');

  const links = [];
  linksElements.each((i, el) => {
    links.push($(el).attr('href'));
  });

  const linksNames = [];
  for (let [index, link] of links.entries()) {
    if (!link) {
      linksNames.push('');
      continue;
    }

    if (link.includes('http') && !link.includes(url.origin)) {
      linksNames.push(link);
      continue;
    }

    // if (link.includes('rss')) {
    //   linksNames.push(link);
    //   continue;
    // }

    if (/^\/[^\/]/.test(link) && checkExtension(link)) {
      linksNames.push(makeFileName(url.origin + link));
      link = url.origin + link;
    }
    if (/^\/[^\/]/.test(link) && !checkExtension(link)) {
      linksNames.push(makeFileName(url.origin + link) + '.html');
      link = url.origin + link;
      continue;
    }

    if (/^\/\//.test(link && checkExtension(link))) {
      linksNames.push(makeFileName(url.origin + link));
      link = url.protocol + link;
    }
    if (/^\/\//.test(link && !checkExtension(link))) {
      linksNames.push(makeFileName(url.origin + link) + '.html');
      link = url.protocol + link;
      continue;
    }

    try {
      const data = await axios.get(link).then((res) => res.data);
      await writeFile(directoryPath + '/' + linksNames[index], data);
    } catch (error) {
      console.log('Axios can`t get ' + link);
    }
  }

  linksElements.each((i, el) => {
    $(el).attr('href', linksNames[i]);
  });
}

export default parseLinks;
