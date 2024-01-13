import makeFileName from '../src/makeFileName.js';
import path from 'path';
import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import chalk from 'chalk';

async function run(url, output) {
  const directory = output ? process.cwd() + output : process.cwd();
  console.log(directory);
  const fileName = makeFileName(url);
  let filepath = path.join(directory, fileName);

  let html;
  try {
    html = await axios.get(url).then((res) => res.data);
  } catch (error) {
    console.log(chalk.red('Ошибка при загрузке страницы: ' + url));
    process.exit(1);
  }

  try {
    await writeFile(filepath, html);
  } catch (error) {
    console.log(chalk.red(error.stack));
  }

  return { filepath };
}

export default run;
