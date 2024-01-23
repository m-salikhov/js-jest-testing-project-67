import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import makeFileName from './makeFileName';
import { checkExtension } from './makeFileName';

async function parseScripts($, directoryPath, url) {
  const scriptsElements = $('script');

  const scripts = [];
  scriptsElements.each((i, el) => {
    scripts.push($(el).attr('src'));
  });

  console.log(url.origin);

  const scriptsNames = [];
  for (let [index, script] of scripts.entries()) {
    if (!script) {
      scriptsNames.push('');
      continue;
    }

    if (script.includes('http') && !script.includes(url.origin)) {
      scriptsNames.push(script);
      continue;
    }

    if (script.includes(url.origin)) {
      scriptsNames.push(makeFileName(script));
    }

    if (/^\/[^\/]/.test(script) && checkExtension(script)) {
      scriptsNames.push(makeFileName(url.origin + script));
      script = url.origin + script;
    }

    if (/^\/\//.test(script && checkExtension(script))) {
      scriptsNames.push(makeFileName(url.origin + script));
      script = url.protocol + script;
    }

    try {
      const data = await axios.get(script).then((res) => res.data);
      await writeFile(directoryPath + '/' + scriptsNames[index], data);
    } catch (error) {
      console.log('Axios can`t get ' + script);
    }
  }

  scriptsElements.each((i, el) => {
    $(el).attr('src', scriptsNames[i]);
  });
}

export default parseScripts;
