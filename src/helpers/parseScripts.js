import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import debugLogger from '../utils/debugLog.js';
import { getExtension, makeURL, makeName } from '../utils/UrlTransform.js';

async function parseScripts($, directoryPath, url) {
  const scriptsElements = $('script');

  const scripts = [];
  scriptsElements.each((i, el) => {
    scripts.push($(el).attr('src'));
  });

  const scriptsWithURL = makeURL(scripts, url);

  const scriptsForHTML = [];

  for (let script of scriptsWithURL.values()) {
    if (!getExtension(script)) {
      scriptsForHTML.push(script);
      continue;
    }
    const data = await axios
      .get(script, { responseType: 'arraybuffer' })
      .then((res) => res.data)
      .catch((error) => {
        handleAxiosError(error);
      });

    try {
      const fileName = makeName(script);
      await writeFile(directoryPath + '/' + fileName, data);
      scriptsForHTML.push(fileName);
      debugLogger('file script created %o', fileName);
    } catch (error) {
      console.log('Axios can`t get ' + script);
    }
  }

  scriptsElements.each((i, el) => {
    $(el).attr('src', scriptsForHTML[i]);
  });
}

export default parseScripts;
