#!/usr/bin/env node

import { program } from 'commander';
import savePage from '../src/index.js';
import chalk from 'chalk';

program
  .description('Download and save html')
  .option('-o, --output <char>', 'directory for save html')
  .version('0.0.1', '-v, -V, --version', 'output the current version')
  .argument('<url>')
  .action(async (url, option) => {
    const output = option.output ? option.output : '';

    const { directoryPath } = await savePage(url, output);

    console.log(chalk.green('Page saved: ' + directoryPath));
  });

program.parse(process.argv);
